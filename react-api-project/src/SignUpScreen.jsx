import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginScreen.css'; // Import your CSS file

const SignUpScreen = () => {
  const [registered, setRegistered] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
      }

      setRegistered(true);
      setTimeout(() => {
        setRegistered(false); // Reset registered state after 2 seconds
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to register');
    }
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="https://cdn.shopify.com/s/files/1/0078/2555/5571/files/Logo_1024x1024_2c61b247-46bc-4be0-a3f3-5205a844dac7.jpg?v=1655885571" alt="Mandaue Foam Logo" className="logo" />
      </div>
      <div className="login-form">
        <h2>Sign Up</h2>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button id='register-button' onClick={handleSignUp}>Register</button>
        {error && <p className="error">{error}</p>}
        {registered && <p className="alert">Registration Successful. Redirecting...</p>}
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default SignUpScreen;
