import express from "express";
import multer from "multer";
import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from "../../helpers/cloudinary.js";
import fs from "fs";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

const deleteLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting file:", err);
  });
};

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);

    deleteLocalFile(req.file.path);

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

    await deleteMediaFromCloudinary(decodedId);

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
    const results = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadMediaToCloudinary(file.path);
        deleteLocalFile(file.path);
        return result;
      })
    );

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
