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
    console.log('view');
    const plant = await Plant.findOne({ user_id: req.user.id, _id: req.params.id });
    const gardens = await Garden.find({ user_id: req.user._id });
    const gardenLabel = gardens.filter(garden => garden._id.toString() === plant.garden_id.toString())[0].label;
    console.log(gardenLabel);
    if (!plant || !gardens) {
      res.send('Plant not found');
    } else {
      res.render('garden/plants/view', { plant: plant, types: TYPES, gardens: gardens, gardenLabel: gardenLabel });
    }

  } catch (error) {
    console.log(error);
  }

};

const updatePlant = async (req, res) => {
  try {
    console.log(req.files);
    const filePath = req?.files[0]?.path;
    const plant = await Plant.findOne({ _id: req.params.id, user_id: req.user._id });

    if (filePath) {
      const photoData = await uploadFile(filePath);
      const photoResp = await Plant.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, {
        photos: [...plant.photos, {
          public_id: photoData.public_id,
          url: photoData.url,
          caption: req.body.photo_caption
        }]
      });
      console.log(photoResp);
    }

    // Update in DB
    const resp = await Plant.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, req.body);
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
          resolve({ public_id: result.public_id, url: result.secure_url });
        });
    } catch (error) {
      reject(error);
    }
  });
}

function destroyFile(public_id) {
  return new Promise((resolve, reject) => {
    try {
      cloudinary.uploader.destroy(public_id, async (error, result) => {
        if (error) return reject(error);
        if (result) resolve(true);
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

const deletePhoto = async (req, res) => {
  try {
    const plantId = req.params.id;
    const photoId = req.query.photo;
    const plant = await Plant.findById(plantId);

    // Destroy in Cloudinary
    const result = await destroyFile(photoId);
    console.log(result);

    // Delete in DB
    const filtered = plant.photos.filter(photo => photo.public_id !== photoId);
    const update = await Plant.findByIdAndUpdate(plantId, { photos: filtered });
    console.log(update);
    if (update) {
      res.redirect(`/gardens/plants/${plantId}?updated=true`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { newPlant, createPlant, viewPlant, updatePlant, deletePlant, deletePhoto };