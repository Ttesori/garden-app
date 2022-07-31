const mongoose = require('mongoose');

const GardenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.ObjectId
  },
  label: {
    type: String,
    required: true
  },
  season: {
    type: String,
  },
  location: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }

}, { timestamps: true });

module.exports = mongoose.model('Garden', GardenSchema);