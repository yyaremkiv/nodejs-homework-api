const express = require("express");
const router = express.Router();
// const multer = require("multer");
const { upload } = require("../helpers/uploads");

const { asyncWrapper } = require("../helpers/apiHelpers");

const {
  signupController,
  loginController,
  logoutController,
  currentController,
  avatarsController,
} = require("../controllers/authController");

const { signValidation } = require("../middlewares/validationMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/signup", signValidation, asyncWrapper(signupController));
router.post("/login", signValidation, asyncWrapper(loginController));
router.get("/logout", authMiddleware, asyncWrapper(logoutController));
router.get("/current", authMiddleware, asyncWrapper(currentController));
router.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  asyncWrapper(avatarsController)
);

module.exports = { authRouter: router };
