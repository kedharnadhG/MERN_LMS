import express from "express";
import multer from "multer";
// import {
//   uploadMediaToCloudinary,
//   deleteMediaFromCloudinary,
// } from "../../helpers/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "MERN_LMS",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "pdf", "mp4"],
    resource_type: "auto",
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = req.file;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading file",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const decodedId = decodeURIComponent(id);
    if (!decodedId) {
      return res.status(400).json({
        success: false,
        message: "File ID is required",
      });
    }

    await cloudinary.uploader.destroy(decodedId);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting file",
    });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const results = req.files;

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      data: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading files",
    });
  }
});

export default router;
