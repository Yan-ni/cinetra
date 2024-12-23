const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
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
    favorite: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: String,
      required: true,
    },
    show_id: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Show", showSchema);
