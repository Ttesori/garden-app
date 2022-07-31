const User = require('../models/User');
const Garden = require('../models/Garden');
const bcrypt = require('bcrypt');

// GET /
const getIndex = async (req, res) => {
  console.log(req.user);
  // Get All Gardens
  const gardens = await Garden.find({ user_id: req.user._id });
  console.log(gardens);
  res.render('garden/index', { user: req.user, gardens: gardens });
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

const newGarden = (req, res) => {
  res.render('garden/new', { user: req.user });
};

const postGarden = async (req, res) => {
  console.log(req.body);
  const { label, season, location, notes } = req.body;
  if (!label) {
    res.render('garden/new', { user: req.user, msg: { type: 'error', text: 'Garden must have a label.' } });
  }

  const garden = {
    user_id: req.user._id,
    label, season, location, notes
  };
  try {
    const resp = await Garden.create(garden);
    console.log(resp);
    if (resp) {
      res.redirect('/gardens?add=true');
    }
  } catch (error) {
    console.log(error);
  }
};
const singleGarden = async (req, res) => {
  try {
    const garden = await Garden.findById(req.params.id);
    res.render('garden/view', { garden: garden });
  } catch (error) {
    console.log(error);
  }
};

const updateGarden = async (req, res) => {
  const { label, season, location, notes, _id } = req.body;

  try {
    const gardenToUpdate = await Garden.findById(_id);
    const newGarden = {
      label: gardenToUpdate.label,
      season: gardenToUpdate.season,
      location: gardenToUpdate.location,
      notes: gardenToUpdate.notes
    };

    if (gardenToUpdate.user_id.toString() !== req.user._id.toString()) {
      return res.send('You do not have permission to update this garden');
    }

    if (label !== newGarden.label) newGarden.label = label;
    if (season !== newGarden.season) newGarden.season = season;
    if (location !== newGarden.location) newGarden.location = location;
    if (notes !== newGarden.notes) newGarden.notes = notes;

    const resp = await Garden.findByIdAndUpdate(_id, newGarden);
    if (resp) {
      console.log(resp);
      res.render('garden/view', { garden: { ...resp, ...newGarden } });
    }
  } catch (error) {
    console.log(error);
  }


};

module.exports = { getIndex, getProfile, postProfile, postGarden, newGarden, singleGarden, updateGarden };