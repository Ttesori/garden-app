const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  display_name: {
    type: String,
    default: ''
  },
  zone: {
    type: String,
    default: ''
  }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);