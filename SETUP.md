# 🚀 CryptoVault - Setup Guide

## Prerequisites
- Node.js 14+ (Download from https://nodejs.org)
- MongoDB (Local or MongoDB Atlas)
- npm or yarn

## Installation Steps

### Step 1: Clone Repository
```bash
git clone https://github.com/hilabu55-cmd/crypto-vault.git
cd crypto-vault
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/crypto-vault
JWT_SECRET=your_super_secret_key_change_this_123!
PORT=5000
NODE_ENV=development
```

### Step 4: Start MongoDB

**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGO_URI in .env

### Step 5: Start Backend Server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Trading
- `POST /api/trading/buy` - Buy Bitcoin
- `POST /api/trading/sell` - Sell Bitcoin
- `GET /api/price/current` - Current price

### User
- `GET /api/user/profile` - User profile
- `GET /api/user/transactions` - Trade history

### Market
- `GET /api/price/history?hours=24` - Price history
- `GET /api/leaderboard` - Rankings

## Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Atlas and update MONGO_URI
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
crypto-vault/
├── server.js              # Main backend
├── package.json           # Dependencies
├── .env.example           # Environment template
├── README.md              # Documentation
└── SETUP.md              # This file
```

## Features

✅ User registration & login
✅ $10,000 demo funds
✅ Real-time Bitcoin prices
✅ Buy/Sell trading
✅ Price charts
✅ Transaction history
✅ Global leaderboard
✅ Black & Orange design
✅ Responsive UI

## Security

- Passwords hashed with bcryptjs
- JWT authentication
- CORS enabled
- Environment variables for secrets

## License

MIT
