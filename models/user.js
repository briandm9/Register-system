const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  lastEmailSent: { type: Date, default: null },
  lastPasswordChange: { type: Date, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);