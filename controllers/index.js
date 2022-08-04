const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const validator = require('email-validator');

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
  req.logout(function (err) {
    if (err) { return next(err); }

    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err);
      req.user = null;
      res.redirect('/');
    });
  });
};

// POST /login
const postUser = (req, res, next) => {
  try {
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        return res.render('index', { error: true });
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        console.log(user);
        res.redirect('/gardens');
      });
    })(req, res, next);
  } catch (error) {
    console.log(error);
  }
};

// POST /register
const postRegister = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!validator.validate(email)) {
    return res.render('register', { error: 'Your email address is not valid' });
  }
  if (password.length < 6) {
    return res.render('register', { error: 'Your password must be at least 6 characters' });
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
  res.redirect('/garden');
};

module.exports = { getIndex, getRegister, getLogout, postUser, postRegister };