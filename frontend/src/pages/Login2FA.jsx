import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GlassCard from '../components/GlassCard';
import axios from 'axios';
import { useAsyncValue, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const Login2FA = () => {
  const Navigate = useNavigate();
  const { logout } = useAuth0();
  const { user, isAuthenticated } = useAuth0();
  useEffect(async()=>{
    if(isAuthenticated){
      console.log(user);
      //check if regitered
      const checkregister=await axios.post("http://localhost:4999/check-register",
        {
          email:user.email
        }
      )
      console.log(checkregister.data);
      
      // check if registered in 2fa
      //ifregistered both then 2fa
      
  }
  },[])
 
    const [authMethod, setAuthMethod] = useState(''); // Track chosen authentication method
    const [otp, setOTP] = useState('');

    const selectAuthMethod = (method) => {
        setAuthMethod(method);
    }
    const verifyPasskey = async () => {
        console.log("Verifying passkey...");
        // Mocked for demonstration, replace with actual API call
    }
    const verifyAutheticatorOTP = async () => {
        const username = await localStorage.getItem('username');
        const response = await axios.post('http://localhost:4999/loginVerifyOTP', {
            username,
            otp
        });
        if(response.data.success){
            Navigate('/');
        }
    }
  return (
    <Container>
      <div className="auth-container">
        <GlassCard>
          <h1>Two Factor Authentication</h1>
          <div className="auth-options">
            <StyledButton onClick={() => selectAuthMethod('authenticator')}>
            Authenticate with Authenticator App
            </StyledButton>
            <StyledButton onClick={() => selectAuthMethod('passkey')}>
              Authenticate with Passkey
            </StyledButton>
          </div>
            {authMethod === 'authenticator' && (
                <div className="authenticator-auth">
                    <h2>Authenticator App</h2>
                    <StyledInput type="text" placeholder="Enter OTP" value={otp} onChange={(e)=>setOTP(e.target.value)}/>
                    <StyledButton onClick={verifyAutheticatorOTP}>Submit</StyledButton>
                </div>
            )}
            {authMethod === 'passkey' && (
                <div className="passkey-auth">
                    <h2>Passkey Authentication</h2>
                    <StyledButton onClick={verifyPasskey}>Verify with Passkey</StyledButton>
                </div>
            )}
        </GlassCard>
      </div>
    </Container>
  );
};

// Styled Components

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  .auth-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const StyledButton = styled.button`
  background-color: #333;
  color: #fff;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444;
  }

  &:active {
    background-color: #222;
  }
  margin-top: 20px;
`;

const StyledInput = styled.input`
  padding: 10px;
  width: 80%;
  margin: auto;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;


export default Login2FA;
