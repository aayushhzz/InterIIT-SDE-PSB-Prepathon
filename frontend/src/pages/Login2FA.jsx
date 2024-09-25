import React, { useState } from 'react';
import styled from 'styled-components';
import GlassCard from '../components/GlassCard';

const Login2FA = () => {
  const [authMethod, setAuthMethod] = useState(''); // Track chosen authentication method
  const [email, setEmail] = useState('');           // User email for OTP
  const [otp, setOtp] = useState('');               // OTP entered by the user
  const [otpSent, setOtpSent] = useState(false);    // Whether the OTP has been sent
  const [authError, setAuthError] = useState('');   // To store any errors
  const [passkeySuccess, setPasskeySuccess] = useState(false); // Whether passkey was successful

  // Handles selection of authentication method
  const selectAuthMethod = (method) => {
    setAuthMethod(method);
    setAuthError('');
    setOtpSent(false);
    setPasskeySuccess(false);
  };

  // Handles sending OTP (Email 2FA)
  const sendOTP = async () => {
    if (email) {
      setOtpSent(true);
      setAuthError('');
    } else {
      setAuthError('Please provide a valid email address');
    }
  };

  // Handles OTP verification
  const verifyOTP = async () => {
    // Mocked for demonstration, replace with actual API call
  };

  // Handles Passkey Authentication (WebAuthn)
  const handlePasskeyAuth = async () => {
    // Mocked for demonstration, replace with actual API call
  };

  return (
    <Container>
      <div className="auth-container">
        <GlassCard>
          <h1>Two Factor Authentication</h1>
          {/* Choose between Email OTP and Passkey */}
          <div className="auth-options">
            <StyledButton onClick={() => selectAuthMethod('email')}>
            Authenticate with Authenticator App
            </StyledButton>
            <StyledButton onClick={() => selectAuthMethod('passkey')}>
              Authenticate with Passkey
            </StyledButton>
          </div>

          {authMethod === 'email' && (
            <div className="email-auth">
              <h2>Authenticator App</h2>
              {!otpSent ? (
                <>
                  <StyledInput
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <StyledButton onClick={sendOTP}>Send OTP</StyledButton>
                </>
              ) : (
                <>
                  <StyledInput
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <StyledButton onClick={verifyOTP}>Verify OTP</StyledButton>
                </>
              )}
            </div>
          )}

          {authMethod === 'passkey' && (
            <div className="passkey-auth">
              <h2>Passkey Authentication</h2>
              <StyledButton onClick={handlePasskeyAuth}>Authenticate with Passkey</StyledButton>
            </div>
          )}

          {authError && <ErrorMessage>{authError}</ErrorMessage>}
          {passkeySuccess && <SuccessMessage>Passkey authentication successful!</SuccessMessage>}
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

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

const SuccessMessage = styled.p`
  color: green;
  margin-top: 10px;
`;

export default Login2FA;
