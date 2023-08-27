const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  posterURL: {
    type: String,
    required: true
  },
  seasonsWatched: {
    type: Number,
    default: 0
  },
  episodesWatched: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Show', showSchema);