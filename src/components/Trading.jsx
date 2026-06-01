import React, { useState } from 'react';

function Trading({ token, balance, bitcoins, price, onTrade }) {
  const [action, setAction] = useState('buy');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      showMessage('כנס סכום תקף', 'error');
      return;
    }

    setLoading(true);

    try {
      const endpoint = action === 'buy'
        ? 'http://localhost:5000/api/trading/buy'
        : 'http://localhost:5000/api/trading/sell';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || 'שגיאה', 'error');
        return;
      }

      showMessage(
        action === 'buy' 
          ? `קנית ${data.transaction.bitcoins.toFixed(8)} ₿ ב-$${data.transaction.price.toFixed(2)}`
          : `מכרת ${data.transaction.bitcoins.toFixed(8)} ₿ ב-$${data.transaction.price.toFixed(2)}`,
        'success'
      );
      
      setAmount('');
      onTrade();
    } catch (error) {
      showMessage('שגיאת חיבור', 'error');
      console.error('Trade error:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const costInDollars = amount ? (parseFloat(amount) * price).toFixed(2) : 0;
  const saleValue = amount ? (parseFloat(amount) * price).toFixed(2) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Trading Form */}
      <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 140, 0, 0.1)', border: '1px solid rgba(255, 140, 0, 0.3)' }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#ff8c00' }}>💰 מסחר</h2>

        {/* Action Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setAction('buy'); setMessage(''); }}
            className={`flex-1 py-3 rounded-lg font-bold transition`}
            style={{
              backgroundColor: action === 'buy' ? '#ff8c00' : 'rgba(255, 140, 0, 0.2)',
              color: action === 'buy' ? '#000000' : '#ffffff'
            }}
          >
            🟢 קנייה
          </button>
          <button
            onClick={() => { setAction('sell'); setMessage(''); }}
            className={`flex-1 py-3 rounded-lg font-bold transition`}
            style={{
              backgroundColor: action === 'sell' ? '#ff8c00' : 'rgba(255, 140, 0, 0.2)',
              color: action === 'sell' ? '#000000' : '#ffffff'
            }}
          >
            🔴 מכירה
          </button>
        </div>

        <form onSubmit={handleTrade} className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {action === 'buy' ? 'כמות בדולרים' : 'כמות ביטקוין'}
            </label>
            <input
              type="number"
              step="0.00001"
              placeholder={action === 'buy' ? 'הכנס סכום בדולרים' : 'הכנס כמות ביטקוין'}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500"
            />
          </div>

          {/* Summary */}
          <div className="p-4 rounded-lg bg-gray-900 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">מחיר יחידה:</span>
              <span className="text-white">₿1 = ${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold" style={{ color: '#ff8c00' }}>
              <span>{action === 'buy' ? 'עלות כוללת:' : 'הכנסה:'}</span>
              <span>${action === 'buy' ? costInDollars : saleValue}</span>
            </div>
            {action === 'buy' && (
              <div className="flex justify-between text-sm text-gray-400">
                <span>קבלה:</span>
                <span>{amount ? (parseFloat(amount) / price).toFixed(8) : 0} ₿</span>
              </div>
            )}
          </div>

          {/* Validation */}
          {action === 'buy' && amount && parseFloat(costInDollars) > balance && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
              ⚠️ יתרה לא מספיקה!
            </div>
          )}

          {action === 'sell' && amount && parseFloat(amount) > bitcoins && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
              ⚠️ אין לך מספיק ביטקוין!
            </div>
          )}

          {message && (
            <div className={`p-3 rounded-lg border text-sm ${messageType === 'success' ? 'bg-green-900 border-green-700 text-green-200' : 'bg-red-900 border-red-700 text-red-200'}`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !amount || (action === 'buy' && parseFloat(costInDollars) > balance) || (action === 'sell' && parseFloat(amount) > bitcoins)}
            className="w-full py-3 rounded-lg font-bold text-black transition"
            style={{
              backgroundColor: action === 'buy' ? '#22c55e' : '#ef4444'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.opacity = '0.8')}
            onMouseLeave={(e) => !loading && (e.target.style.opacity = '1')}
          >
            {loading ? 'עיבוד...' : (action === 'buy' ? '🟢 קנייה' : '🔴 מכירה')}
          </button>
        </form>
      </div>

      {/* Balance Info */}
      <div className="space-y-4">
        <div className="p-6 rounded-lg" style={{ background: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
          <h3 className="text-xl font-bold mb-4 text-green-400">💵 יתרת דולרים</h3>
          <p className="text-4xl font-bold text-white mb-2">${balance.toFixed(2)}</p>
          <p className="text-gray-400 text-sm">זמין למסחר</p>
        </div>

        <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 140, 0, 0.1)', border: '1px solid rgba(255, 140, 0, 0.3)' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#ff8c00' }}>₿ ביטקוין בתיק</h3>
          <p className="text-4xl font-bold text-white mb-2">{bitcoins.toFixed(8)}</p>
          <p className="text-gray-400 text-sm">שווי: ${(bitcoins * price).toFixed(2)}</p>
        </div>

        <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 165, 0, 0.1)', border: '1px solid rgba(255, 165, 0, 0.3)' }}>
          <h3 className="text-xl font-bold mb-4 text-yellow-400">📊 סה"כ תיק</h3>
          <p className="text-4xl font-bold text-white mb-2">${(balance + bitcoins * price).toFixed(2)}</p>
        </div>

        {/* Tips */}
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
          <p className="text-sm text-gray-300 mb-3">💡 <span style={{ color: '#ff8c00' }}>טיפים למסחר:</span></p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• עקוב אחרי המחירים ברגע זמן</li>
            <li>• השקע בהדרגה, לא הכל בבת אחת</li>
            <li>• סימולציה לצרכי חינוך בלבד</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Trading;