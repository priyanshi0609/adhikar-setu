// App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './../firebase/firebase.js';
import ClaimantDashboard from './components/ClaimantDashboard.jsx';
// import './styles/components.css';

// Simple login component (you can enhance this)
const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo purposes, create a mock user
    const mockUser = {
      uid: 'demo-user-' + Date.now(),
      email: email || 'demo@example.com',
      displayName: 'Demo User'
    };
    onLogin(mockUser);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>FRA Document Digitization System</h2>
        <p>Enter your email to access the dashboard</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="login-input"
          />
          <button type="submit" className="login-button">
            Enter Dashboard
          </button>
        </form>
        <small>This is a demo system. In production, use proper authentication.</small>
      </div>
    </div>
  );
};

function FinalDoc() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <ClaimantDashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default FinalDoc;