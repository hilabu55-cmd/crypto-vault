import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crypto-vault')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ==================== SCHEMAS ====================

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 10000 },
  bitcoins: { type: Number, default: 0 },
  transactions: [{
    type: { type: String, enum: ['buy', 'sell'] },
    amount: Number,
    bitcoins: Number,
    price: Number,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Price History Schema
const priceHistorySchema = new mongoose.Schema({
  price: Number,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);

// ==================== HELPER FUNCTIONS ====================

async function getCurrentBitcoinPrice() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    return response.data.bitcoin.usd;
  } catch (error) {
    console.error('Error fetching price:', error);
    return null;
  }
}

async function savePriceHistory() {
  const price = await getCurrentBitcoinPrice();
  if (price) {
    await PriceHistory.create({ price });
  }
}

// Save price every 5 minutes
setInterval(savePriceHistory, 5 * 60 * 1000);

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      balance: 10000
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, username, email, balance: user.balance }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration error', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email, balance: user.balance, bitcoins: user.bitcoins }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
});

// ==================== MIDDLEWARE ====================

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ==================== TRADING ROUTES ====================

// Get current price
app.get('/api/price/current', async (req, res) => {
  try {
    const price = await getCurrentBitcoinPrice();
    if (!price) {
      return res.status(500).json({ message: 'Could not fetch price' });
    }
    res.json({ price });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price' });
  }
});

// Get price history
app.get('/api/price/history', async (req, res) => {
  try {
    const hours = req.query.hours || 24;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const history = await PriceHistory.find({ timestamp: { $gte: startTime } })
      .sort({ timestamp: 1 });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

// Buy Bitcoin
app.post('/api/trading/buy', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const price = await getCurrentBitcoinPrice();
    const cost = amount * price;

    if (user.balance < cost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= cost;
    user.bitcoins += amount;
    user.transactions.push({
      type: 'buy',
      amount: cost,
      bitcoins: amount,
      price
    });

    await user.save();

    res.json({
      message: 'Purchase successful',
      balance: user.balance,
      bitcoins: user.bitcoins,
      transaction: user.transactions[user.transactions.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: 'Buy error', error: error.message });
  }
});

// Sell Bitcoin
app.post('/api/trading/sell', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);

    if (amount <= 0 || amount > user.bitcoins) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const price = await getCurrentBitcoinPrice();
    const revenue = amount * price;

    user.balance += revenue;
    user.bitcoins -= amount;
    user.transactions.push({
      type: 'sell',
      amount: revenue,
      bitcoins: amount,
      price
    });

    await user.save();

    res.json({
      message: 'Sale successful',
      balance: user.balance,
      bitcoins: user.bitcoins,
      transaction: user.transactions[user.transactions.length - 1]
    });
  } catch (error) {
    res.status(500).json({ message: 'Sell error', error: error.message });
  }
});

// Get user profile
app.get('/api/user/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const price = await getCurrentBitcoinPrice();
    const totalValue = user.balance + (user.bitcoins * price);

    res.json({
      username: user.username,
      email: user.email,
      balance: user.balance,
      bitcoins: user.bitcoins,
      totalValue,
      currentPrice: price
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Get transactions
app.get('/api/user/transactions', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.transactions.slice(-50)); // Last 50 transactions
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const price = await getCurrentBitcoinPrice();
    const users = await User.find().select('username balance bitcoins');
    
    const leaderboard = users.map(user => ({
      username: user.username,
      balance: user.balance,
      bitcoins: user.bitcoins,
      totalValue: user.balance + (user.bitcoins * price)
    })).sort((a, b) => b.totalValue - a.totalValue);

    res.json(leaderboard.slice(0, 100)); // Top 100
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// ==================== SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  savePriceHistory(); // Save initial price
});
