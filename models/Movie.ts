import mongoose, { Schema, Document, Model } from "mongoose";

interface ShowType extends Document {
  name: string;
  overview: string;
  posterURL: string;
  favorite: boolean;
  user_id: string;
  show_id: number;
}

const movieSchema: Schema<ShowType> = new mongoose.Schema(
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

const Show: Model<ShowType> = mongoose.model<ShowType>("Movie", movieSchema);

export default Show;