const express = require('express');
const mongoose = require('mongoose');
const User =  require('./models/User.js');
const cors = require('cors');
require('dotenv').config();
const crypto = require("node:crypto");
const { 
    generateRegistrationOptions, 
    verifyRegistrationResponse, 
    generateAuthenticationOptions, 
    verifyAuthenticationResponse 
} = require('@simplewebauthn/server')

const connectDB = require('./db.js');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');



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


app.post('/register',async (req, res) => {
  const { username, email ,password } = req.body
  if(await User.findOne({username: username})){
    return res.status(400).json({error: 'User already exists'});
  }
  if(await User.findOne({email: email})){
    return res.status(400).json({error: 'Email already exists'});
  }
  const user = {
      username,
      email,
      password

  }
  let created = false;
  const usr = await User.create(user);
  if(usr){
    created = true;
  }
  else{
    res.status(400).json({error: 'User not created'});
  }
  return res.json({ username , created});

})

app.post('/register-challenge', async (req, res) => {
  const { userId } = req.body

  if (!userStore[userId]) return res.status(404).json({ error: 'user not found!' })

  // const user = userStore[userId]

  const challengePayload = await generateRegistrationOptions({
      rpID: 'localhost',
      rpName: 'My Localhost Machine',
      attestationType: 'none',
      userName: user.username,
      timeout: 30_000,
  })

  challengeStore[userId] = challengePayload.challenge

  return res.json({ options: challengePayload })

})

app.post('/register-verify', async (req, res) => {
  const { userId, cred }  = req.body
  
  if (!userStore[userId]) return res.status(404).json({ error: 'user not found!' })

  // const user = userStore[userId]
  // const challenge = challengeStore[userId]

  const verificationResult = await verifyRegistrationResponse({
      expectedChallenge: challenge,
      expectedOrigin: process.env.SERVER_URL,
      expectedRPID: 'localhost',
      response: cred,
  })

  if (!verificationResult.verified) return res.json({ error: 'could not verify' });
  // userStore[userId].passkey = verificationResult.registrationInfo

  return res.json({ verified: true })

})

app.post('/login-challenge', async (req, res) => {
  const { userId } = req.body
  if (!userStore[userId]) return res.status(404).json({ error: 'user not found!' })
  
  const opts = await generateAuthenticationOptions({
      rpID: 'localhost',
  })

  challengeStore[userId] = opts.challenge

  return res.json({ options: opts })
})

app.post('/login-verify', async (req, res) => {
  const { userId, cred }  = req.body

  if (!userStore[userId]) return res.status(404).json({ error: 'user not found!' })
  const user = userStore[userId]
  const challenge = challengeStore[userId]

  const result = await verifyAuthenticationResponse({
      expectedChallenge: challenge,
      expectedOrigin: process.env.SERVER_URL,
      expectedRPID: 'localhost',
      response: cred,
      authenticator: user.passkey
  })

  if (!result.verified) return res.json({ error: 'something went wrong' })
  
  // Login the user: Session, Cookies, JWT
  return res.json({ success: true, userId })
})

//authenticator app 2fa
app.post('/getQR',async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({username: username});
  if(!user){
    return res.status(400).json({error: 'User not found'});
  }
  const secret = await speakeasy.generateSecret(
    {name:`${username} Inter-IIT SDE`}
  );
  const image = await qrcode.toDataURL(secret.otpauth_url);
  user.tempsecret = secret.ascii;
  await user.save();
  return res.json({ image,success: true });
});
//verify otp at register
app.post('/registerVerifyOTP',async (req, res) => {
  const { username, otp } = req.body;
  const user = await User.findOne({username});
  if(!user){
    return res.status(400).json({error: 'User not found'});
  }
  const verified = speakeasy.totp.verify({
    secret: user.tempsecret,
    encoding: 'ascii',
    token: otp
  });
  if(verified){
    user.secret = user.tempsecret;
    user.tempsecret = undefined;
    await user.save();
    return res.json({ success: true });
  }
  return res.status(400).json({error: 'Invalid OTP'});
});
//verify otp at login
app.post('/loginVerifyOTP',async (req, res) => {
  const { username, otp } = req.body;
  const user = await User.findOne({username});
  if(!user){
    return res.status(400).json({error: 'User not found'});
  }
  if(!user.secret){
    return res.status(400).json({error: 'Enable 2FA!!'});
  }
  const verified = speakeasy.totp.verify({
    secret: user.secret,
    encoding: 'ascii',
    token: otp
  });
  if(verified){
    user.secret = user.tempsecret;
    user.tempsecret = undefined;
    await user.save();
    return res.json({ success: true });
  }
  return res.status(400).json({error: 'Invalid OTP'});
});