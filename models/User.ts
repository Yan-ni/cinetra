import mongoose, { Schema, Document, Model } from "mongoose";

interface UserType extends Document {
  username: string
  password: string
}

const userSchema: Schema<UserType> = new mongoose.Schema<UserType>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User: Model<UserType> = mongoose.model("User", userSchema);

export default User;
