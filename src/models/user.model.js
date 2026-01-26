import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    fullname: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: true }, //url from cloudinary
    coverImage: { type: String }, //url from cloudinary
    refreshToken: { type: String, required: true },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: { type: String, required: [true, "password is req"] },
    refreshToken: { type: String },
  },

  {
    timestamps: true,
  }
);

//Hashing the password before saving it in the database using mongoose Hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

//checking the password which is in hash with the password provided by the user
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); //will returen the value in boolean
};

//Generate Token
userSchema.methods.generateAcessToken = function () {
  return jwt.sign(
    {
      id: this._id, //_id is the id of the datbase.
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
};

//Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id, //_id is the id of the datbase.
      username: this.username,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
