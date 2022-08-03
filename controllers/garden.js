const User = require('../models/User');
const Garden = require('../models/Garden');
const Plant = require('../models/Plant');
const bcrypt = require('bcrypt');
const { marked } = require('marked');

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
    const gardenId = req.params.id;
    const garden = await Garden.findById(gardenId);
    const notes = marked.parse(garden.notes);
    console.log('parseed', notes);

    const plants = await Plant.find({ garden_id: gardenId, user_id: req.user._id });
    res.render('garden/view', { garden: garden, plants: plants, notes: notes });
  } catch (error) {
    console.log(error);
  }
};

const updateGarden = async (req, res) => {
  const { label, season, location, notes } = req.body;
  const gardenId = req.params.id;


  try {
    const gardenToUpdate = await Garden.find({ user_id: req.user._id, _id: gardenId });
    const newGarden = {
      label: gardenToUpdate.label,
      season: gardenToUpdate.season,
      location: gardenToUpdate.location,
      notes: gardenToUpdate.notes
    };

    if (!gardenToUpdate) {
      return res.send('Garden not found');
    }
    console.log(notes);
    if (label !== newGarden.label) newGarden.label = label;
    if (season !== newGarden.season) newGarden.season = season;
    if (location !== newGarden.location) newGarden.location = location;
    if (notes !== newGarden.notes) newGarden.notes = notes;

    const resp = await Garden.findByIdAndUpdate(gardenId, newGarden);
    const plants = await Plant.find({ garden_id: gardenId, user_id: req.user._id });
    if (resp) {
      console.log(resp);
      res.render('garden/view', { garden: { ...resp, ...newGarden }, plants: plants, notes: marked.parse(notes) });
    }
  } catch (error) {
    console.log(error);
  }
};

const archiveGarden = async (req, res) => {
  const id = req.params.id;
  try {
    const resp = await Garden.findOneAndUpdate({ _id: id, user_id: req.user._id }, { active: false });
    if (resp) {
      res.redirect('/gardens?archive=true');
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteGarden = async (req, res) => {
  console.log('working on deleting...');
  try {
    const idToDel = req.params.id;

    // Make sure user has permission to delete
    const garden = await Garden.findById(idToDel);
    if (garden && (garden.user_id.toString() === req.user._id.toString())) {
      // Remove garden
      const resp = await Garden.findByIdAndDelete(idToDel);
      if (resp) {
        // Redirect on success
        res.redirect('/gardens?delete=true');
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getIndex, getProfile, postProfile, postGarden, newGarden, singleGarden, updateGarden, deleteGarden, archiveGarden };