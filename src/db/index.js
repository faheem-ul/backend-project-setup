import mongoose from "mongoose";
import { db_name } from "../constants.js";

const DBConnect = async () => {
  try {
    mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`);
    console.log("DB is connected");
  } catch (error) {
    console.error("Error in the connection of Db", error);
  }
};

export default DBConnect;
