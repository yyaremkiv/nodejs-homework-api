const express = require("express");
const router = express.Router();
const { upload } = require("../helpers/uploads");

const { asyncWrapper } = require("../helpers/apiHelpers");

const {
  signupController,
  loginController,
  logoutController,
  currentController,
  avatarsController,
  veryfyRegistrationController,
  repeatedVeryfyRegistrationController,
} = require("../controllers/authController");

const {
  signValidation,
  repeatedVerifyValidation,
} = require("../middlewares/validationMiddleware");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/signup", signValidation, asyncWrapper(signupController));
router.post("/login", signValidation, asyncWrapper(loginController));
router.post(
  "/verify/",
  repeatedVerifyValidation,
  asyncWrapper(repeatedVeryfyRegistrationController)
);
router.get("/logout", authMiddleware, asyncWrapper(logoutController));
router.get("/current", authMiddleware, asyncWrapper(currentController));
router.get(
  "/verify/:verificationToken",
  asyncWrapper(veryfyRegistrationController)
);
router.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  asyncWrapper(avatarsController)
);

module.exports = { authRouter: router };
