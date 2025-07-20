import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // We'll create this next

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Here you would typically make an API call to your backend
    console.log('Login attempt with:', { email, password });
    
    // For demo purposes, we'll just navigate on any non-empty submission
    navigate('/feed'); // You'll need to set up this route
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" className="login-button">Login</button>
        
        <div className="forgot-password">
          <a href="/forgot-password">Forgot password?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;