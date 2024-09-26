import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import GlassCard from "../components/GlassCard";
import axios from "axios";

const Register2FA = () => {
    const Navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState(""); // Track chosen authentication method
  const [image, setImage] = useState(null);
    const [otp, setOTP] = useState('');

  const setUpMethod = async (method) => {
    if (method === "authenticator") {
      let username = await localStorage.getItem("username");
      const response = await axios.post("http://localhost:4999/getQR", {
        username: username ,
      });
      setImage(response.data.image);
    }
    if (method === "passkey") {
      // Mocked for demonstration, replace with actual API call
      console.log("Setting up Passkey...");
    }
  };
  const selectAuthMethod = (method) => {
    setAuthMethod(method);
    setUpMethod(method);
  };
  const verifyOTP = async () => {
    const username = await localStorage.getItem("username");
    const response = await axios.post("http://localhost:4999/registerVerifyOTP", {
      username,
      otp,
    });
    if (response.data.success) {
      Navigate("/login");
    }
  };
  const setupPasskey = async () => {
    console.log("Setting up passkey...");
    // Mocked for demonstration, replace with actual API call
  };
  return (
    <Container>
      <div className="auth-container">
        <GlassCard>
          <h1>Setup/Update Two Factor Authentication</h1>
          <div className="auth-options">
            <StyledButton onClick={() => selectAuthMethod("authenticator")}>
              Use Authenticator App
            </StyledButton>
            <StyledButton onClick={() => selectAuthMethod("passkey")}>
              Use Passkey
            </StyledButton>
          </div>

          {authMethod === "authenticator" && image && (
            <div className="authenticator-auth">
              <h2>Authenticator App</h2>
              <img src={image} alt="qr code" height={"100px"} width={"100px"} />
              <p>Scan this QR Code</p>
              <StyledInput type="text" placeholder="Enter OTP" value={otp} onChange={(e)=> setOTP(e.target.value)}/>
              <StyledButton onClick={verifyOTP}>Verify OTP</StyledButton>
            </div>
          )}
          {authMethod === "passkey" && (
            <div className="passkey-auth">
              <h2>Passkey Authentication</h2>
              <StyledButton onClick={setupPasskey}>Setup Passkey</StyledButton>
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
    align-items: center;
    justify-content: center;
  }
  .auth-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
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
  width: 60%;
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

export default Register2FA;
