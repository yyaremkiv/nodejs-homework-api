const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { v4: uuid4 } = require("uuid");
const sendEmail = require("../helpers/sendEmail");
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
  const verifyToken = uuid4();

  try {
    await sendEmail({ verifyToken, email });
  } catch (err) {
    throw new RegistrationConflictError("registration not complite");
  }

  const existEmail = await Users.findOne({ email });
  if (existEmail) {
    throw new RegistrationConflictError("Email in use");
  }

  if (await Users.exists({ email })) {
    throw new RegistrationConflictError("Email in use");
  }
  const avatarURL = gravatar.url(email);

  const contact = await Users.create({ email, password, avatarURL });
  return contact;
};

const login = async (email, password) => {
  const user = await Users.findOne({ email });

  if (
    !user ||
    !(await bcrypt.compare(password, user.password)) ||
    !user.verify
  ) {
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

const verifyUser = async (verifyToken) => {
  const user = await Users.findOne({ verifyToken });
  if (user) {
    await user.updateOne({ verify: true, verifyToken: null });
    return;
  }
  throw new RegistrationConflictError("User not found");
};

const repeateSendingMail = async ({ email }) => {
  const user = await Users.findOne({ email });
  if (user && !user.verify) {
    try {
      await sendEmail({ verifyToken: user.verifyToken, email });
      return;
    } catch (err) {
      throw new RegistrationConflictError("registration not complite");
    }
  }
  if (user && user.verify) {
    throw new LoginAuthError("Verification has already been passed");
  }
  if (!user) {
    throw new LoginAuthError("User not found");
  }
};

module.exports = {
  signUp,
  login,
  logout,
  current,
  avatars,
  verifyUser,
  repeateSendingMail,
};
