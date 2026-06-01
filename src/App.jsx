import React, { useState, useEffect } from 'react';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}>
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard token={token} user={user} onLogout={handleLogout} onProfileUpdate={fetchUserProfile} />
      )}
    </div>
  );
}

export default App;