// pages/LoginPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = () => {
  const Navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(username === '' || password === ''){
      alert('Please fill in all fields');
      return;
    }
    const response = await axios.post('http://localhost:4999/login', {
      username,
      password
    });
    if(response.data.error){
      alert(response.data.error);
      return;
    }
    else{
      localStorage.setItem('username', username);
      Navigate('/login/2fa');
    }
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
