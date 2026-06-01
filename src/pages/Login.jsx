import React, { useState } from 'react';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin 
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';

      const body = isLogin 
        ? { email, password }
        : { username, email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error');
        return;
      }

      onLogin(data.token);
    } catch (error) {
      setError('Connection error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}>
      <div className="w-full max-w-md" style={{ background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 140, 0, 0.3)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '40px' }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="inline-block" style={{ color: '#ff8c00' }}>🔥 Crypto</span>
            <span style={{ color: '#ffffff' }}>Vault</span>
          </h1>
          <p style={{ color: '#ff8c00' }}>Bitcoin Trading Simulator</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-semibold transition`}
            style={isLogin ? { backgroundColor: '#ff8c00', color: '#000000' } : { color: '#999999' }}
          >
            התחברות
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-semibold transition`}
            style={!isLogin ? { backgroundColor: '#ff8c00', color: '#000000' } : { color: '#999999' }}
          >
            הרשמה
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="שם משתמש"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500"
              required={!isLogin}
            />
          )}
          
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500"
            required
          />

          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500"
            required
          />

          {error && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg font-bold transition text-black"
            style={{ backgroundColor: '#ff8c00' }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#ff9d1a')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#ff8c00')}
          >
            {loading ? 'טוען...' : (isLogin ? 'התחברות' : 'הרשמה')}
          </button>
        </form>

        {/* Demo Info */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 140, 0, 0.1)', borderLeft: '3px solid #ff8c00' }}>
          <p className="text-sm text-gray-300 mb-2">💡 <span style={{ color: '#ff8c00' }}>טיפ:</span></p>
          <p className="text-xs text-gray-400">כל משתמש חדש מקבל <span style={{ color: '#ff8c00' }}>$10,000</span> בדמו!</p>
        </div>
      </div>
    </div>
  );
}

export default Login;