import React, { useState, useEffect } from 'react';

function Transactions({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTransactions(data.reverse());
    } catch (error) {
      console.error('Transactions fetch error:', error);
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
        <p className="text-sm text-gray-300">📝 <span style={{ color: '#ff8c00' }}>היסטוריית עסקאות</span> - 50 עסקאות אחרונות</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid rgba(255, 140, 0, 0.3)' }}>
        <table className="w-full">
          <thead style={{ background: 'rgba(255, 140, 0, 0.2)', borderBottom: '1px solid rgba(255, 140, 0, 0.3)' }}>
            <tr>
              <th className="px-6 py-4 text-right text-orange-500 font-bold">סוג</th>
              <th className="px-6 py-4 text-right text-orange-500 font-bold">כמות ביטקוין</th>
              <th className="px-6 py-4 text-right text-orange-500 font-bold">סכום דולרים</th>
              <th className="px-6 py-4 text-right text-orange-500 font-bold">מחיר ליחידה</th>
              <th className="px-6 py-4 text-right text-orange-500 font-bold">זמן</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => {
              const isBuy = tx.type === 'buy';
              const date = new Date(tx.date);
              const timeStr = date.toLocaleString('he-IL');

              return (
                <tr
                  key={index}
                  className="border-b transition hover:bg-gray-900"
                  style={{ borderColor: 'rgba(255, 140, 0, 0.2)' }}
                >
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isBuy ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                      {isBuy ? '🟢 קנייה' : '🔴 מכירה'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right" style={{ color: '#ff8c00' }}>
                    {tx.bitcoins.toFixed(8)} ₿
                  </td>
                  <td className="px-6 py-4 text-right font-semibold" style={{ color: isBuy ? '#ef4444' : '#22c55e' }}>
                    {isBuy ? '-' : '+'}${tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400">
                    ${tx.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400 text-sm">
                    {timeStr}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-400">אין עסקאות עדיין</p>
          <p className="text-gray-500 text-sm mt-2">התחל למסחר כדי לראות את ההיסטוריה שלך</p>
        </div>
      )}
    </div>
  );
}

export default Transactions;