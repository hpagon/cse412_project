import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [asurite, setAsurite] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    // Only validate that Asurite ID is entered
    if (!asurite.trim()) {
      setError('Please enter your Asurite ID');
      return;
    }

    // Password is ignored for demo purposes
    onLogin(userType, asurite);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Campus Portal Login</h1>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label>Asurite ID</label>
            <input
              type="text"
              value={asurite}
              onChange={(e) => setAsurite(e.target.value)}
              placeholder="Enter your Asurite ID"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="form-group">
            <label>User Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button onClick={handleLogin} className="login-button">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
