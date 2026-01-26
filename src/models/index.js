import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      name: String,
      required: true,
    },
    email: {
      email: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default userSchema;
