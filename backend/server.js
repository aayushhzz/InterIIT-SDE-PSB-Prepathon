// server.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// Import routes
app.use('/auth', require('./routes/auth'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Enable 2FA
router.post('/2fa/setup', async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user.twoFactorEnabled) {
      return res.status(400).json({ msg: '2FA is already enabled.' });
    }
    
    const secret = speakeasy.generateSecret({ length: 20 });
    user.twoFactorSecret = secret.base32;
    await user.save();
  
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    res.json({ qrCodeUrl, secret: secret.base32 });
  });
  
  // Verify 2FA
  router.post('/2fa/verify', async (req, res) => {
    const user = await User.findById(req.user.id);
    const { token } = req.body;
  
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });
  
    if (verified) {
      user.twoFactorEnabled = true;
      await user.save();
      res.status(200).json({ msg: '2FA enabled successfully' });
    } else {
      res.status(400).json({ msg: 'Invalid token' });
    }
  });

  
  // Update Password
router.post('/password/update', async (req, res) => {
    const user = await User.findById(req.user.id);
    const { newPassword } = req.body;
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  
    res.status(200).json({ msg: 'Password updated successfully' });
  });

  
  // Password Recovery (send email)
router.post('/password/recovery', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
  
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `http://localhost:3000/password/reset/${token}`;
    
    // Send email (using nodemailer)
    // Assuming you have a function sendEmail to handle this
    sendEmail(user.email, 'Password Reset', `Click this link to reset your password: ${resetLink}`);
    
    res.json({ msg: 'Password reset email sent' });
  });
  