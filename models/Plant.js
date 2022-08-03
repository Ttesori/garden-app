const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.ObjectId,
    required: true
  },
  garden_id: {
    type: mongoose.ObjectId,
    required: true
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  number_of_plants: {
    type: Number,
  },
  planting_date: {
    type: String,
  },
  source: {
    type: String,
  },
  last_water: {
    type: String,
  },
  last_feed: {
    type: String,
  },
  pest_issues: {
    type: String,
  },
  notes: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true
  },
  photos: {
    type: [{
      public_id: String,
      url: String,
      caption: String
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Plant', PlantSchema);