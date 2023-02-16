const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "tmp/" });

const { asyncWrapper } = require("../helpers/apiHelpers");

const {
  signupController,
  loginController,
  logoutController,
  currentController,
  avatarsController,
} = require("../controllers/authController");

const { signValidation } = require("../middlewares/validationMiddleware");
const { logoutMiddleware } = require("../middlewares/logoutMiddleware");

router.get("/logout", logoutMiddleware, asyncWrapper(logoutController));
router.get("/current", logoutMiddleware, asyncWrapper(currentController));
router.post("/signup", signValidation, asyncWrapper(signupController));
router.post("/login", signValidation, asyncWrapper(loginController));
router.patch(
  "/avatars",
  logoutMiddleware,
  upload.single("avatar"),
  asyncWrapper(avatarsController)
);

module.exports = { authRouter: router };
