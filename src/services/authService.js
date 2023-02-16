const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { Users } = require("../db/userModel");
const {
  RegistrationConflictError,
  LoginAuthError,
} = require("../helpers/errors");

const signUp = async (email, password) => {
  if (await Users.exists({ email })) {
    throw new RegistrationConflictError("Email in use");
  }
  const avatarURL = gravatar.url(email);

  const contact = await Users.create({ email, password, avatarURL });
  return contact;
};

const login = async (email, password) => {
  const user = await Users.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new LoginAuthError("Email or password is wrong");
  }

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET
  );

  await Users.findByIdAndUpdate(user._id, { token });
  return token;
};

const logout = async (_id) => {
  const user = await Users.findById({ _id });

  if (!user) {
    throw new LoginAuthError("Not authorized");
  }

  return await Users.findByIdAndUpdate(_id, { token: "" });
};

const current = async (_id) => {
  const user = await Users.findById({ _id });

  return user;
};

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const avatars = async (_id, tempUpload, originalname) => {
  const avatar = await Jimp.read(tempUpload);
  avatar.resize(250, 250);
  avatar.write(tempUpload);

  const filename = `${_id}${originalname}`;

  console.log("service", filename);

  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await Users.findByIdAndUpdate(_id, { avatarURL });

  return avatarURL;
};

module.exports = {
  signUp,
  login,
  logout,
  current,
  avatars,
};
