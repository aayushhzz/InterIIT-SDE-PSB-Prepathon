// pages/LoginPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import '../App.css';
import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { loginWithRedirect } = useAuth0();

  const handleLogin = (e) => {
    e.preventDefault();

  };

  return (
    <div className="auth-container">
      <GlassCard>
        <h2>Login</h2>
        <form onSubmit={handleLogin} >
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
          <button onClick={() => loginWithRedirect()}>Log In , in other ways</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default LoginPage;
