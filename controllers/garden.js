const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET /
const getIndex = (req, res) => {
  console.log(req.user);
  res.render('garden/index', { user: req.user });
};

const getProfile = (req, res) => {
  res.render('garden/profile', { user: req.user });
};

const postProfile = async (req, res) => {
  console.log(req.body, req.user);
  const { email, password, name, zone } = req.body;

  const newUser = {
    email: req.user.email,
    display_name: req.user.display_name,
    zone: req.user.zone
  };

  // If new email, check if exists
  console.log(email, req.user.email);
  if (email !== req.user.email) {
    const exists = await User.findOne({ email: email });
    console.log(exists);
    // If exists, redirect
    if (exists) {
      res.render('garden/profile', { user: req.user, msg: { type: 'error', text: 'Email already exists' } });
    }
    // Otherwise, save
    newUser.email = email;
    req.session.passport.user.email = email;
  }

  // If new password, hash
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const newPassword = hashed;
    newUser.password = newPassword;
    console.log(newPassword);
  }

  // Did display name change?
  if (name) {
    newUser.display_name = name;
  }
  // Did zone change?
  if (zone) {
    newUser.zone = zone;
  }
  console.log('updated', newUser);
  // Update user
  try {
    const resp = await User.findByIdAndUpdate(req.user._id, newUser);
    if (resp) {
      console.log(resp);
      res.render('garden/profile', { user: { ...req.user, ...newUser }, msg: { type: 'success', text: 'Profile updated successfully!' } });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getIndex, getProfile, postProfile };