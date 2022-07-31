const User = require('../models/User');
const Garden = require('../models/Garden');
const Plant = require('../models/Plant');

const newPlant = async (req, res) => {
  try {
    const gardens = await Garden.find({ user_id: req.user._id });
    const types = [
      'Artichokes', 'Arugula', 'Asparagus', 'Beets', 'Broccoli', 'Brussels Sprouts', 'Cabbage', 'Carrots', 'Cauliflower', 'Celery', 'Corn', 'Cucumbers', 'Edamame', 'Eggplants', 'Flowers', 'Garlic', 'Green Beans', 'Herbs', 'Horseradish', 'Kale', 'Kohlrabi', 'Lettuce', 'Okra', 'Onions', 'Parsnips', 'Peas', 'Peppers, Hot', 'Peppers, Sweet', 'Potatoes', 'Pumpkins', 'Radishes', 'Rhubarb', 'Rutabagas', 'Spinach', 'Sweet Potatoes', 'Swiss Chard', 'Tomatoes', 'Turnips', 'Winter Squash', 'Zucchini',];
    console.log(gardens);
    res.render('garden/plants/new', { gardens: gardens, types: types });
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

module.exports = { newPlant, createPlant };