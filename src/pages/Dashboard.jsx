import React, { useState, useEffect } from 'react';
import PriceChart from '../components/PriceChart.jsx';
import Trading from '../components/Trading.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import Transactions from '../components/Transactions.jsx';

function Dashboard({ token, user, onLogout, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [userBalance, setUserBalance] = useState(user?.balance || 0);
  const [userBitcoins, setUserBitcoins] = useState(user?.bitcoins || 0);

  useEffect(() => {
    fetchPrice();
    const priceInterval = setInterval(fetchPrice, 10000);
    return () => clearInterval(priceInterval);
  }, []);

  const fetchPrice = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/price/current');
      const data = await response.json();
      setCurrentPrice(data.price);
    } catch (error) {
      console.error('Price fetch error:', error);
    }
  };

  const handleTrade = () => {
    onProfileUpdate();
    fetchPrice();
  };

  const totalValue = userBalance + (userBitcoins * currentPrice);
  const profitLoss = totalValue - 10000;
  const profitPercent = (profitLoss / 10000 * 100).toFixed(2);

  const navItems = [
    { id: 'dashboard', label: 'דשבורד', icon: '📊' },
    { id: 'trading', label: 'מסחר', icon: '💰' },
    { id: 'leaderboard', label: 'דירוג', icon: '🏆' },
    { id: 'transactions', label: 'עסקאות', icon: '📝' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'rgba(255, 140, 0, 0.3)', background: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            <span style={{ color: '#ff8c00' }}>🔥 Crypto</span>
            <span style={{ color: '#ffffff' }}>Vault</span>
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-gray-400 text-sm">משתמש</p>
              <p className="font-semibold" style={{ color: '#ff8c00' }}>{user?.username}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg font-semibold transition text-black"
              style={{ backgroundColor: '#ff8c00' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ff9d1a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff8c00'}
            >
              יציאה
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard label="יתרה בדולרים" value={`$${userBalance.toFixed(2)}`} icon="💵" />
          <StatsCard label="ביטקוין בתיק" value={userBitcoins.toFixed(8)} icon="₿" />
          <StatsCard label="מחיר ביטקוין" value={`$${currentPrice.toFixed(2)}`} icon="📈" />
          <StatsCard 
            label="ערך כולל"
            value={`$${totalValue.toFixed(2)}`}
            subtext={`${profitPercent}%`}
            icon="🎯"
            isProfit={profitLoss >= 0}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b" style={{ borderColor: 'rgba(255, 140, 0, 0.3)' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-6 py-3 font-semibold transition border-b-2`}
              style={{
                borderBottomColor: activeTab === item.id ? '#ff8c00' : 'transparent',
                color: activeTab === item.id ? '#ff8c00' : '#999999'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dashboard' && (
            <PriceChart token={token} currentPrice={currentPrice} />
          )}
          
          {activeTab === 'trading' && (
            <Trading token={token} balance={userBalance} bitcoins={userBitcoins} price={currentPrice} onTrade={handleTrade} />
          )}
          
          {activeTab === 'leaderboard' && (
            <Leaderboard />
          )}
          
          {activeTab === 'transactions' && (
            <Transactions token={token} />
          )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, subtext, icon, isProfit = null }) {
  return (
    <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 140, 0, 0.1)', border: '1px solid rgba(255, 140, 0, 0.3)' }}>
      <p className="text-gray-400 text-sm mb-2">{icon} {label}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtext && (
        <p style={{ color: isProfit ? '#4ade80' : '#f87171' }} className="text-sm font-semibold">
          {isProfit ? '↑' : '↓'} {subtext}
        </p>
      )}
    </div>
  );
}

export default Dashboard;