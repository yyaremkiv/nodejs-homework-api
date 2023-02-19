const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { Users } = require("../db/userModel");
const {
  RegistrationConflictError,
  LoginAuthError,
} = require("../helpers/errors");
const {
  avatarRenameAndSave,
  avatarDelete,
} = require("../helpers/avatarSaver.js");

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

const avatars = async (_id, token, pathAvatar) => {
  const oldAvatarURL = await Users.findOne({ _id, token }, "avatarURL -_id");

  if (oldAvatarURL.avatarURL) {
    await avatarDelete(oldAvatarURL.avatarURL);
  }

  const avatarURL = await avatarRenameAndSave(pathAvatar);
  const updatedCurrentUserAvatar = await Users.findOneAndUpdate(
    { _id, token },
    { $set: { avatarURL } },
    {
      new: true,
      projection: "avatarURL -_id",
    }
  );

  if (!updatedCurrentUserAvatar) {
    throw new LoginAuthError("Not authorized");
  }
  return updatedCurrentUserAvatar;
};

module.exports = {
  signUp,
  login,
  logout,
  current,
  avatars,
};
