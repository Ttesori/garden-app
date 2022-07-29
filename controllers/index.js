const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET /
const getIndex = (req, res) => {
  res.render('index');
};

// GET /register
const getRegister = (req, res) => {
  res.render('register');
};

// GET /logout
const getLogout = (req, res) => {

};

// POST /login
const postUser = (req, res) => {

};

// POST /register
const postRegister = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (email.length < 3 || password.length < 3) {
    return res.redirect('/register?errors=true');
  }

  // Create user object
  const user = new User({
    email, password
  });

  // Check for existing user
  let result = await User.findOne({ email });
  console.log('exists', result);
  if (result) {
    return res.redirect('/register?exists=true');
  }

  // Generate Password
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    user.password = hashed;

    // Create user
    const resp = await user.save();
    console.log(resp);

  } catch (error) {
    console.log(error);
  }
  res.send('Signed up!');
};

module.exports = { getIndex, getRegister, getLogout, postUser, postRegister };