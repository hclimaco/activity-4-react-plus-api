import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginScreen.css'; // Import your CSS file

const LoginScreen = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }

      const data = await response.json();
      const token = data.token;
      localStorage.setItem('token', token); // Store token in localStorage
      setLoggedIn(true);
      navigate('/products');
    } catch (error) {
      setError(error.message || 'Failed to login');
    }
  };

  if (loggedIn) {
    navigate('/products'); // Redirect if already logged in
  }

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="https://cdn.shopify.com/s/files/1/0078/2555/5571/files/Logo_1024x1024_2c61b247-46bc-4be0-a3f3-5205a844dac7.jpg?v=1655885571" alt="Mandaue Foam Logo" className="logo" />
      </div>
      <div className="login-form">
        <h2>Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button id='login-button' onClick={handleLogin}>Login</button>
        {error && <p className="error">{error}</p>}
        {loggedIn && <p className="alert">Redirecting...</p>}
        <p>Don't have an account? <a href="/signup">Create an account</a></p>
      </div>
    </div>
  );
};

export default LoginScreen;
