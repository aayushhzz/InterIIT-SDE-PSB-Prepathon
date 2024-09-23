// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  displayName: String,
  email: String,
  password: String,
  twoFactorSecret: String,  // For 2FA
  twoFactorEnabled: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
