import React, { useState, useEffect } from 'react';

function PriceChart({ token, currentPrice }) {
  const [chartType, setChartType] = useState('line');
  const [timeframe, setTimeframe] = useState(24);
  const [priceData, setPriceData] = useState([]);

  useEffect(() => {
    fetchPriceHistory();
  }, [timeframe]);

  const fetchPriceHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/price/history?hours=${timeframe}`);
      const data = await response.json();
      setPriceData(data);
    } catch (error) {
      console.error('Error fetching price history:', error);
    }
  };

  const timeframes = [
    { value: 24, label: '24 שעות' },
    { value: 168, label: 'שבוע' },
    { value: 720, label: 'חודש' }
  ];

  // Simple chart rendering with ASCII
  const getMinPrice = () => Math.min(...priceData.map(d => d.price));
  const getMaxPrice = () => Math.max(...priceData.map(d => d.price));
  const minPrice = getMinPrice();
  const maxPrice = getMaxPrice();
  const range = maxPrice - minPrice || 1;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2">
          {['line', 'area', 'candlestick'].map(type => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-4 py-2 rounded-lg font-semibold transition`}
              style={{
                backgroundColor: chartType === type ? '#ff8c00' : 'rgba(255, 140, 0, 0.2)',
                color: chartType === type ? '#000000' : '#ffffff'
              }}
            >
              {type === 'line' && '📈 קו'}
              {type === 'area' && '📊 אזור'}
              {type === 'candlestick' && '🕯️ נרות'}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {timeframes.map(tf => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition`}
              style={{
                backgroundColor: timeframe === tf.value ? '#ff8c00' : 'rgba(255, 140, 0, 0.2)',
                color: timeframe === tf.value ? '#000000' : '#ffffff'
              }}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 rounded-lg" style={{ background: 'rgba(255, 140, 0, 0.1)', border: '1px solid rgba(255, 140, 0, 0.3)' }}>
        <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '2px', padding: '20px' }}>
          {priceData.length > 0 ? (
            priceData.map((d, i) => {
              const height = ((d.price - minPrice) / range) * 100;
              return (
                <div
                  key={i}
                  style={{
                    height: `${Math.max(height, 5)}%`,
                    backgroundColor: '#ff8c00',
                    borderRadius: '2px',
                    opacity: 0.7 + (i / priceData.length) * 0.3,
                    flex: 1
                  }}
                  title={`$${d.price.toFixed(2)}`}
                />
              );
            })
          ) : (
            <p className="text-gray-400">טוען נתונים...</p>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoBox label="מחיר נוכחי" value={`$${currentPrice.toFixed(2)}`} icon="💵" />
        <InfoBox label="שוק" value="סימולציה בזמן אמת" icon="🌐" />
        <InfoBox label="מקור" value="CoinGecko API" icon="🔌" />
      </div>
    </div>
  );
}

function InfoBox({ label, value, icon }) {
  return (
    <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 140, 0, 0.1)', border: '1px solid rgba(255, 140, 0, 0.3)' }}>
      <p className="text-gray-400 text-sm mb-1">{icon} {label}</p>
      <p className="font-semibold text-white">{value}</p>
    </div>
  );
}

export default PriceChart;