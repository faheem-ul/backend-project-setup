import dotenv from "dotenv";
import mongoose from "mongoose";
import { db_name } from "./constants.js";
import DBConnect from "./db/index.js";
import express from "express";
import { asyncHandler } from "./utils/asyncHandler.js";
import { ApiError } from "./utils/ApiError.js";

// console.log("APi Error", ApiError.statusCode);

dotenv.config({
  path: "./env",
});
// console.log(process.env.MONGODB_URL);

const app = express();

DBConnect();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`);

//     console.log("DB is connected");
//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("Error in connecting DB", error);
//   }
// })();

// async function DBConnection() {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`);
//     console.log("DB is connected");
//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("Error in connecting DB", error);
//   }
// }

// DBConnection();
