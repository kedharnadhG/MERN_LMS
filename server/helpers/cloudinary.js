import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMediaToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "MERN_LMS",
      resource_type: "auto",
    });

    console.log(result);

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading to Cloudinary");
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
      folder: "MERN_LMS",
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting asset from Cloudinary");
  }
};
