const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../db/userModel");
const {
  RegistrationConflictError,
  LoginAuthError,
} = require("../helpers/errors");

const signUp = async (email, password) => {
  if (await Users.exists({ email })) {
    throw new RegistrationConflictError("Email in use");
  }

  const contact = await Users.create({ email, password });
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

module.exports = {
  signUp,
  login,
  logout,
  current,
};
