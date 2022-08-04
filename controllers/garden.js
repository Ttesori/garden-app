const Garden = require('../models/Garden');
const Plant = require('../models/Plant');

// GET /
const getIndex = async (req, res) => {
  console.log(req.user);
  // Get All Gardens
  const gardens = await Garden.find({ user_id: req.user._id });
  console.log(gardens);
  res.render('garden/index', { user: req.user, gardens: gardens });
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

    const plants = await Plant.find({ garden_id: gardenId, user_id: req.user._id });
    res.render('garden/view', { garden: garden, plants: plants });
  } catch (error) {
    console.log(error);
  }
};

const updateGarden = async (req, res) => {
  const gardenId = req.params.id;

  try {
    const gardenToUpdate = await Garden.find({ user_id: req.user._id, _id: gardenId });

    if (!gardenToUpdate) {
      return res.send('Garden not found');
    }

    const resp = await Garden.findByIdAndUpdate(gardenId, { ...req.body }, { returnDocument: 'after' });
    const plants = await Plant.find({ garden_id: gardenId, user_id: req.user._id });
    if (resp) {
      console.log(resp);
      res.render('garden/view', { garden: resp, plants: plants });
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

module.exports = { getIndex, postGarden, newGarden, singleGarden, updateGarden, deleteGarden, archiveGarden };