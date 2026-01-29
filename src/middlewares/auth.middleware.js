import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); //sometimes the user is of the mobile then the token is not in cookies instead it is in the header

    // console.log("cookies access Token", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized! Access token is missing");
    }

    // console.log("access token secret", process.env.ACCESS_TOKEN_SECRET);

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log("decoded token", decodedToken);

    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken",
    );
    // console.log("user from verify jwt middleware", user);
    if (!user) {
      throw new ApiError(401, "error in verifying the jwt token");
    }
    req.user = user; //attaching the user to the request object
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error.message || "Unauthorized! Invalid access token",
    );
  }
});
