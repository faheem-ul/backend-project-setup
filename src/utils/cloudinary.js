import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const UploadFileonCloudinary = async (fileFromUser) => {
  try {
    if (!fileFromUser) return;
    //uploading the file
    const uploadResult = await cloudinary.uploader.upload(fileFromUser, {
      resource_type: "auto",
    });
    return console.log("File uploaded successfully", uploadResult.url); //explore the options provided by the variable which stores the procedure of uploading the file
  } catch (error) {
    fs.unlinkSync(fileFromUser); // as the uploading operation will got failed then instead of saving the file on our server, this will delete it so that any corrupted files are not there.
    console.error("Error in uploading file", error);
    return null;
  }
};

export { UploadFileonCloudinary };
