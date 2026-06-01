# 🔥 CryptoVault - Bitcoin Trading Simulator

סימולטור מסחר בביטקוין עם עיצוב מדהים - שחור וכתום!

## ✨ תכונות
- 💰 $10,000 בדמו לכל משתמש
- 📈 גרפים אינטרקטיביים (קו, אזור, נרות)
- 📊 לוח ניקוד עם דירוג גלובלי
- 🔐 הרשמה והתחברות מאובטחת
- 🎨 עיצוב מודרני שחור-כתום
- 📱 Responsive ל-mobile
- 💻 Real-time Bitcoin prices

## 🛠️ Technology Stack
- **Frontend:** React + TypeScript + Tailwind CSS + Chart.js
- **Backend:** Node.js + Express + MongoDB
- **Authentication:** JWT
- **API:** CoinGecko (Real-time Bitcoin prices)

## 📦 Project Structure
```
crypto-vault/
├── server.js                 # Main backend server
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── src/
│   ├── App.jsx              # Main app component
│   ├── index.html           # HTML entry point
│   ├── pages/
│   │   ├── Login.jsx        # Login/Register page
│   │   └── Dashboard.jsx    # Main dashboard
│   └── components/
│       ├── PriceChart.jsx   # Price charts (line, area, candlestick)
│       ├── Trading.jsx      # Buy/Sell interface
│       ├── Leaderboard.jsx  # Global rankings
│       └── Transactions.jsx # Trade history
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/hilabu55-cmd/crypto-vault.git
cd crypto-vault

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
```

### Running the Application

#### 1. Start MongoDB
```bash
# If local MongoDB is installed
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env
```

#### 2. Start Backend Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

#### 3. Open in Browser
```
http://localhost:5000
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Trading
- `POST /api/trading/buy` - Buy Bitcoin
- `POST /api/trading/sell` - Sell Bitcoin

### Market Data
- `GET /api/price/current` - Get current Bitcoin price
- `GET /api/price/history?hours=24` - Get price history

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/transactions` - Get transaction history

### Social
- `GET /api/leaderboard` - Get global leaderboard

## 🎨 Design Features

### Color Scheme
- **Primary Background:** Black (#000000)
- **Accent Color:** Orange (#ff8c00)
- **Text:** White (#ffffff)
- **Dark Glass:** Glassmorphism effect with transparency

### Responsive Design
- Mobile-first approach
- Tablets and desktop optimized
- Touch-friendly buttons and inputs

## 💡 Usage

1. **Sign Up** - Create new account with username and email
2. **Get $10,000** - Every new user receives demo funds
3. **Trade** - Buy and sell Bitcoin with real-time prices
4. **Track** - Monitor your portfolio value and transactions
5. **Compete** - Climb the global leaderboard

## 🔒 Security

- Passwords hashed with bcryptjs
- JWT token authentication
- CORS enabled
- Environment variables for sensitive data
- MongoDB data validation

## 📈 Chart Types

- **Line Chart** - Classic price trends
- **Area Chart** - Visual volume representation
- **Candlestick** - OHLC data (planned)

## ⏰ Real-time Updates

- Price updates every 10 seconds
- Leaderboard updates every 30 seconds
- Live transaction history
- WebSocket ready for future enhancements

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Make sure MongoDB is running
mongod

# Or update MONGO_URI in .env for MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crypto-vault
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📝 Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/crypto-vault
JWT_SECRET=your_super_secret_key_change_this_123!
PORT=5000
NODE_ENV=development
COINGECKO_API=https://api.coingecko.com/api/v3
```

## 🎯 Features Planned

- [ ] WebSocket for real-time updates
- [ ] Advanced technical analysis
- [ ] Portfolio analytics
- [ ] Social features (follow users)
- [ ] Alerts and notifications
- [ ] Mobile app (React Native)

## 📄 License

MIT License - feel free to use this project for learning and development!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues, please open an issue on GitHub.

---

**Built with ❤️ and ☕**

⭐ If you like this project, please give it a star!
