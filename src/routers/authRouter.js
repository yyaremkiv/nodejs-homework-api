const express = require("express");
const router = express.Router();

const { asyncWrapper } = require("../helpers/apiHelpers");

const {
  signupController,
  loginController,
  logoutController,
  currentController,
} = require("../controllers/authController");

const { signValidation } = require("../middlewares/validationMiddleware");
const { logoutMiddleware } = require("../middlewares/logoutMiddleware");

router.post("/signup", signValidation, asyncWrapper(signupController));
router.post("/login", signValidation, asyncWrapper(loginController));
router.get("/logout", logoutMiddleware, asyncWrapper(logoutController));
router.get("/current", logoutMiddleware, asyncWrapper(currentController));
module.exports = { authRouter: router };
