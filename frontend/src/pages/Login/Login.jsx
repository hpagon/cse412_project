import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const API_URL = "http://localhost:3000/api";

const Login = ({ onLogin }) => {
  const [asurite, setAsurite] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!asurite.trim()) {
      setError("Please enter your Asurite ID");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        asuriteUserID: asurite,
        password: password,
      });

      // response.data contains full user profile with role
      onLogin(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid credentials");
      } else {
        setError(
          err.response?.data?.error || "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
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
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handleLogin}
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
