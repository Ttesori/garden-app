const Garden = require('../models/Garden');
const Plant = require('../models/Plant');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { rejects } = require('assert');
const TYPES = [
  'Artichokes', 'Arugula', 'Asparagus', 'Beets', 'Broccoli', 'Brussels Sprouts', 'Cabbage', 'Carrots', 'Cauliflower', 'Celery', 'Corn', 'Cucumbers', 'Edamame', 'Eggplants', 'Flowers', 'Garlic', 'Green Beans', 'Herbs', 'Horseradish', 'Kale', 'Kohlrabi', 'Lettuce', 'Okra', 'Onions', 'Parsnips', 'Peas', 'Peppers, Hot', 'Peppers, Sweet', 'Potatoes', 'Pumpkins', 'Radishes', 'Rhubarb', 'Rutabagas', 'Spinach', 'Sweet Potatoes', 'Swiss Chard', 'Tomatoes', 'Turnips', 'Winter Squash', 'Zucchini',];

const newPlant = async (req, res) => {
  try {
    const gardens = await Garden.find({ user_id: req.user._id });
    res.render('garden/plants/new', { gardens: gardens, types: TYPES, gardenId: req.query.garden });
  } catch (error) {

  }

};

const createPlant = async (req, res) => {
  const { name, garden_id } = req.body;
  if (!name || !garden_id) {
    return res.redirect('/gardens/plants/new?error=name');
  }

  try {
    const resp = await Plant.create({
      ...req.body,
      user_id: req.user._id
    });
    console.log(resp);
    res.redirect(`/gardens/${req.body.garden_id}`);
  } catch (error) {
    console.log(error);
  }
};

const viewPlant = async (req, res) => {
  try {
    const plant = await Plant.findOne({ user_id: req.user.id, _id: req.params.id });
    const gardens = await Garden.find({ user_id: req.user._id });
    console.log(plant);
    if (!plant || !gardens) {
      res.send('Plant not found');
    } else {
      res.render('garden/plants/view', { plant: plant, types: TYPES, gardens: gardens });
    }

  } catch (error) {

  }

};

const updatePlant = async (req, res) => {
  try {
    console.log(req.files);
    const filePath = req.files[0].path;
    let link;
    if (filePath) {
      link = await uploadFile(filePath);
    }
    console.log(link);

    // Update in DB
    const plant = await Plant.findOne({ _id: req.params.id, user_id: req.user._id });
    const resp = await Plant.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, { ...req.body, photos: [...plant.photos, link] });
    if (resp) {
      console.log(resp);
      res.redirect(`/gardens/plants/${req.params.id}?updated=true`);
    }
  } catch (err) {
    console.log(err);
  }
};

function uploadFile(file) {
  return new Promise((resolve, reject) => {
    try {
      cloudinary.uploader.upload(file,
        async (error, result) => {
          if (error) return reject(error);
          //remove temp file
          fs.unlinkSync(file);
          resolve(result.url);
        });
    } catch (error) {
      reject(error);
    }
  });
}

const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
    if (plant) {
      console.log(plant);
      res.redirect(`/gardens/${plant.garden_id}`);
    } else {
      res.send('Plant not found');
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { newPlant, createPlant, viewPlant, updatePlant, deletePlant };