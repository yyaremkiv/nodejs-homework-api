const {
  signUp,
  login,
  logout,
  current,
  avatars,
} = require("../services/authService");

const signupController = async (req, res) => {
  const { email, password } = req.body;

  const user = await signUp(email, password);

  res.status(201).json({
    user: { email: user.email, subscription: user.subscription },
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const token = await login(email, password);

  res.json({ token, message: "Success" });
};

const logoutController = async (req, res) => {
  const { _id } = req.user;

  await logout(_id);

  res.status(201).json({ message: "Success" });
};

const currentController = async (req, res) => {
  const { _id } = req.user;
  const user = await current(_id);

  res.status(201).json({ user, message: "Succerss" });
};

const avatarsController = async (req, res) => {
  const { _id } = req.user;
  const token = req.token;
  const pathAvatar = req.file.path;

  const { avatarURL } = await avatars(_id, token, pathAvatar);

  res.status(200).json({
    avatarURL,
  });
};

module.exports = {
  signupController,
  loginController,
  logoutController,
  currentController,
  avatarsController,
};
