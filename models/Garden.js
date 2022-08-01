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
  },
  notes: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Garden', GardenSchema);