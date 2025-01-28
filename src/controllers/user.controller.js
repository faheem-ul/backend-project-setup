import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { UploadFileonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  //Upload files on cloudinary
  const avatar = await UploadFileonCloudinary(avatarLocalPath);
  const coverImage = await UploadFileonCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Error uploading files to cloudinary");
  }
  //creating the object in database
  const userinDatabase = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  const CreatedUserId = User.findById(userinDatabase._id).select(
    "-password -refreshToken"
  );

  if (!CreatedUserId) {
    throw new ApiError(500, "Error creating user in database");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, CreatedUserId, "User created successfully"));
});

export { registerUser };
