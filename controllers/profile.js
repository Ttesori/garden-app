const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const nodemailer = require("nodemailer");

const getProfile = (req, res) => {
  res.render('profile', { user: req.user });
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
      res.render('profile', { user: req.user, msg: { type: 'error', text: 'Email already exists' } });
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
      res.render('profile', { user: { ...req.user, ...newUser }, msg: { type: 'success', text: 'Profile updated successfully!' } });
    }
  } catch (error) {
    console.log(error);
  }
};

const getReset = (req, res) => {
  res.render('profile/reset');
};

const postReset = async (req, res) => {
  try {
    // find user from email address
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) return res.send('user not found');
    if (user.reset_link) return res.send('link already sent');

    // send email and store string in db
    const rand = crypto.randomBytes(32).toString('hex');
    console.log(rand, email);
    const reset_link = `${process.env.BASE_URL}/profile/reset/${user._id}?key=${rand}`;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      name: 'ttesori.dev',
      auth: {
        user: process.env.GMAIL_UN, // generated ethereal user
        pass: process.env.GMAIL_PW, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Ty" <ttesori.dev@gmail.com>', // sender address
      to: '"Toni" <ttesori@gmail.com>', // list of receivers
      subject: "Password Reset Link", // Subject line
      text: `Your link to reset your password is ${reset_link}`, // plain text body
      html: `<p>Your link to reset your password is <a href="${reset_link}">${reset_link}</a></p>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    if (info.messageId) {
      const result = await User.findByIdAndUpdate(user._id, { reset_link: reset_link });
      console.log(result);
      if (!result) return res.send('something went wrong');
      res.send('sent reset link');
    }

  } catch (error) {
    console.log(error);
  }

};

const getResetPwd = async (req, res) => {
  try {
    const user_id = req.params.id;
    const key = req.query.key;
    const reset_link = `${process.env.BASE_URL}/profile/reset/${user_id}?key=${key}`;
    const user = await User.findOne({ _id: user_id, reset_link: reset_link });
    console.log(user);
    // If link is not found
    if (!user) return res.render('profile/resetPwd', { error: 'link' });
    // if string matches what's in db for id 
    res.render('profile/resetPwd');
  } catch (error) {
    console.log(error);
  }

};

const postResetPwd = async (req, res) => {
  try {
    const user_id = req.params.id;
    const key = req.query.key;
    const reset_link = `${process.env.BASE_URL}/profile/reset/${user_id}?key=${key}`;
    const user = await User.findOne({ _id: user_id, reset_link: reset_link });
    const password = req.body.password;

    // If link is not found
    if (!user) return res.render('profile/resetPwd', { error: 'link' });

    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const newPassword = hashed;
    console.log(newPassword);

    const resp = await User.findByIdAndUpdate(user_id, { reset_link: '', password: newPassword });
    if (resp) {
      console.log(resp);
      //redirect to login
      res.redirect('/?reset=true');
    }
  } catch (error) {
    console.log(error);
  }

};

module.exports = { getProfile, postProfile, getReset, postReset, getResetPwd, postResetPwd };