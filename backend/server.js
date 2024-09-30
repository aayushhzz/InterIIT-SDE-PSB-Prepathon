const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const cors = require("cors");
require("dotenv").config();
const crypto = require("node:crypto");
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require("@simplewebauthn/server");

const connectDB = require("./db.js");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 4998, () => {
  console.log(`Server is running on port ${process.env.PORT || 4998}`);
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (await User.findOne({ email: email })) {
    return res.status(400).json({ error: "User already exists" });
  }
  if (await User.findOne({ email: email })) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const user = {
    username,
    email,
    password,
  };
  let created = false;
  const usr = await User.create(user);
  if (usr) {
    created = true;
  } else {
    res.status(400).json({ error: "User not created" });
  }
  return res.json({ username, created });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log("login");
  
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  if (user.password !== password) {
    return res.status(400).json({ error: "Invalid password" });
  }
  return res.json({ email });
});

app.post("/register-challenge", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) return res.status(404).json({ error: "user not found!" });

  const challengePayload = await generateRegistrationOptions({
    rpID: "localhost",
    rpName: "My Localhost Machine",
    attestationType: "none",
    userName: user.email,
    timeout: 30_000,
  });
  user.challenge = challengePayload.challenge;
  await user.save();
  return res.json({ options: challengePayload });
});

app.post("/register-verify", async (req, res) => {
  const { email, cred } = req.body;

  const user = await User.findOne({ username: username });
  if (!user) return res.status(404).json({ error: "user not found!" });

  const challenge = user.challenge;

  const verificationResult = await verifyRegistrationResponse({
    expectedChallenge: challenge,
    expectedOrigin: "http://localhost:3000",
    expectedRPID: "localhost",
    response: cred,
  });

  if (!verificationResult.verified)
    return res.json({ error: "could not verify" });

  user.passkey = verificationResult.registrationInfo;
  user.twoFAEnabled = true;
  await user.save();
  return res.json({ verified: true });
});

app.post("/login-challenge", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "user not found!" });

  const opts = await generateAuthenticationOptions({
    rpID: "localhost",
  });

  user.loginchallenge = opts.challenge;
  await user.save();
  return res.json({ options: opts });
});

app.post("/login-verify", async (req, res) => {
  const { email, cred } = req.body;
  
  const user = await User.findOne({ email });
  const userPasskey = user.passkey;
  if (!user) return res.status(404).json({ error: "user not found!" });
  const challenge = user.loginchallenge;
  try {
    const verificationResult = await verifyAuthenticationResponse({
      expectedChallenge: challenge,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost",
      response: cred,
      authenticator: {
        credentialID: userPasskey.credentialID,
        credentialPublicKey: new Uint8Array(userPasskey.credentialPublicKey.buffer),
        counter: userPasskey.counter,
      },
    });
    if (!verificationResult.verified) {
      return res.json({ error: "could not verify" });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error("Error during verification:", err);
    return res.status(500).json({ error: "Verification failed" });
  }
});

//authenticator app 2fa
app.post("/getQR", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  const secret = await speakeasy.generateSecret({
    name: `${user.username} Inter-IIT SDE`,
  });
  const image = await qrcode.toDataURL(secret.otpauth_url);
  user.tempsecret = secret.ascii;
  await user.save();
  return res.json({ image, success: true });
});
//verify otp at register
app.post("/registerVerifyOTP", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  const verified = speakeasy.totp.verify({
    secret: user.tempsecret,
    encoding: "ascii",
    token: otp,
  });
  if (verified) {
    user.secret = user.tempsecret;
    user.tempsecret = undefined;
    user.twoFAEnabled = true;
    await user.save();
    return res.json({ success: true });
  }
  return res.status(400).json({ error: "Invalid OTP" });
});
//verify otp at login
app.post("/loginVerifyOTP", async (req, res) => {
  const { email, otp } = req.body;
  console.log("aiskis");
  
  try {
    const user = await User.findOne({ email });
    
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  console.log(user);
  
  if (!user.secret) {
    return res.status(400).json({ error: "Enable 2FA!!" });
  }

  const verified = speakeasy.totp.verify({
    secret: user.secret,
    encoding: "ascii",
    token: otp,
  });
  if (verified) {
    user.secret = user.tempsecret;
    user.tempsecret = undefined;
    await user.save();
    return res.json({ success: true });
  }
  } catch (error) {
    console.log(error);
    
    return res.status(400).json({ error: "Invalid OTP" });
  }
  
});
app.post("/check-register",async (req,res)=>{
  const {email} = req.body;
  const user = await User.findOne({email});
  
  if(user){
    return res.json({success: true, twoFAEnabled: user.twoFAEnabled});
  }
  return res.json({success: false});
}
)