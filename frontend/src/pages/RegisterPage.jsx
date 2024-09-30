import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import axios from 'axios';
import '../App.css';

const RegisterPage = () => {
  const Navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleRegister = async (e) => {
    console.log('register');
    
    e.preventDefault();
    if(!username || !email || !password){
      //toast error
      return;
    }
    if(password.length < 8){
      //toast error
      return;
    }
    let response = await axios.post(`http://localhost:4999/register`, {
      username,
      email,
      password
    });
    if(response.data.created){
      localStorage.setItem('username', username);
      Navigate('/register/2fa');
    }
    else{
      //toast error
    }
    
    
  };

  return (
    <div className="auth-container">
      <GlassCard>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default RegisterPage;
