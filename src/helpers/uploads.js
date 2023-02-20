const path = require("path");
const multer = require("multer");

const UPLOAD_DIR = path.resolve("./tmp");
const AVATARS_DIR = path.resolve("./public/avatars");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, AVATARS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage,
});

module.exports = { upload, UPLOAD_DIR, AVATARS_DIR };
