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
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  number_of_plants: {
    type: Number,
    default: 1
  },
  planting_date: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: ''
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
    default: ''
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