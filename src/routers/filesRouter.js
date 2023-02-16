const express = require("express");
const multer = require("multer");
const path = require("path");

const FILE_DIR = path.resolve("./public/avatars");

const router = new express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const { asyncWrapper } = require("../helpers/apiHelpers");
const { uploadController } = require("../controllers/filesController");
const uploadMiddleware = multer({ storage });

router.post(
  "/upload",
  uploadMiddleware.single("avatar"),
  asyncWrapper(uploadController)
);
router.use("/download", express.static(FILE_DIR));

module.exports = { filesRouter: router };
