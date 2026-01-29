import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { UploadFileonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAcessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    // console.log("user in generate token", user);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;
  // console.log(username, email, password, fullname);

  // validation for the fields
  if (
    [username, email, password, fullname].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check if the username or email already exists
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (user) {
    throw new ApiError(409, "Username or email already exists");
  }
  //files access
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // console.log("avatarLocalPath", avatarLocalPath);

  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  //Upload files on cloudinary
  const avatar = await UploadFileonCloudinary(avatarLocalPath);
  // const coverImage = await UploadFileonCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Error uploading files to cloudinary");
  }
  //creating the object in database
  // console.log("avatar url from cloudinary", avatar);
  // console.log(avatar);
  const userinDatabase = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    password,
    avatar: avatar.url,
    coverImage: "",
  });
  const CreatedUserId = await User.findById(userinDatabase._id).select(
    "-password -refreshToken",
  );

  if (!CreatedUserId) {
    throw new ApiError(500, "Error creating user in database");
  }
  // console.log("CreatedUserId", CreatedUserId);
  return res
    .status(201)
    .json(new ApiResponse(200, CreatedUserId, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //get the email or username and passowrd from the body

  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Email or Username is required");
  }

  // find the user in the db
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // console.log("user from db", user);

  //check the password

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  // console.log("is password correct", isPasswordCorrect);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password is incorrect");
  }

  // generate the access and refresh token
  const { accessToken, refreshToken } = await generateAcessandRefreshToken(
    user._id,
  );

  // set the tokens in database
  const loggedInUser = await User.findByIdAndUpdate(
    user._id,
    { refreshToken },
    { new: true },
  ).select("-password -refreshToken");

  //set the tokens in cookies

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  //clear the refresh token from database
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );
  //clear the cookies
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const generateNewAccessToken = asyncHandler(async (req, res) => {
  //get the old refresh token from the cookies

  const refreshTokenComingFromCookie =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!refreshTokenComingFromCookie) {
    throw new ApiError(401, "Refresh token is missing");
  }

  //decrypt that token and get the id or username or email from that

  const decodedTokenComingFromCookie = jwt.verify(
    refreshTokenComingFromCookie,
    process.env.REFRESH_TOKEN_SECRET,
  );

  //on the basis of what extracted from the decrypted token find the user in the database

  const user = await User.findById(decodedTokenComingFromCookie?.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // compare the token coming from the cookies with the token present in db

  if (user.refreshToken !== refreshTokenComingFromCookie) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // if comaprison is successful then generate new access token and send it to the user

  const { accessToken, refreshToken } = await generateAcessandRefreshToken(
    user._id,
  );

  //send the new access token to the user
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    })
    .json(
      new ApiResponse(
        200,
        { accessToken },
        "New access token generated successfully",
      ),
    );
});

export { registerUser, loginUser, logoutUser, generateNewAccessToken };
