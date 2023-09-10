const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    posterURL: {
      type: String,
      required: true,
    },
    seasonsWatched: {
      type: Number,
      default: 0,
    },
    episodesWatched: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Show", showSchema);
