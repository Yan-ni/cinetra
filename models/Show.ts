import mongoose, { Schema, Document, Model } from "mongoose";

interface ShowType extends Document {
  name: string,
  overview: string,
  posterURL: string,
  seasonsWatched: number,
  episodesWatched: number,
  completed: boolean,
  favorite: boolean,
  user_id: string,
  show_id: number,
}

const showSchema: Schema<ShowType> = new mongoose.Schema<ShowType>(
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

const Show: Model<ShowType> = mongoose.model<ShowType>("Show", showSchema);

export default Show;
