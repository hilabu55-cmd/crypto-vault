import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Leaderboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">טוען...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 140, 0, 0.1)', border: '1px solid rgba(255, 140, 0, 0.3)' }}>
        <p className="text-sm text-gray-300">🏆 <span style={{ color: '#ff8c00' }}>מדי 30 שניות!</span> הדירוג מתעדכן לפי הערך הכולל של התיק.</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid rgba(255, 140, 0, 0.3)' }}>
        <table className="w-full">
          <thead style={{ background: 'rgba(255, 140, 0, 0.2)', borderBottom: '1px solid rgba(255, 140, 0, 0.3)' }}>
            <tr>
              <th className="px-6 py-4 text-right text-orange-500 font-bold">מקום</th>
              <th className="px-6 py-4 text-right text-orange-500 font-bold">שם משתמש</th>
              <th className="px-6 py-4 text-right text-orange-500 font-bold">דולרים</th>
              <th className="px-6 py-4 text-right text-orange-500 font-bold">ביטקוין</th>
              <th className="px-6 py-4 text-right text-orange-500 font-bold">ערך כולל</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => {
              const medalIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '•';
              const profitLoss = user.totalValue - 10000;
              const isProfit = profitLoss >= 0;

              return (
                <tr
                  key={index}
                  className="border-b transition hover:bg-gray-900"
                  style={{ borderColor: 'rgba(255, 140, 0, 0.2)' }}
                >
                  <td className="px-6 py-4 text-center font-bold text-xl">{medalIcon}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{user.username}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-green-400">
                    ${user.balance.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right" style={{ color: '#ff8c00' }}>
                    {user.bitcoins.toFixed(8)} ₿
                  </td>
                  <td className="px-6 py-4 text-right font-bold">
                    <div className="text-white">${user.totalValue.toFixed(2)}</div>
                    <div style={{ color: isProfit ? '#4ade80' : '#f87171' }} className="text-xs font-semibold">
                      {isProfit ? '↑' : '↓'} {profitLoss.toFixed(2)}$
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;