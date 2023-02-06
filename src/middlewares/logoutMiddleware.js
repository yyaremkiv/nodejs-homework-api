const jwt = require("jsonwebtoken");
const { Users } = require("../db/userModel");
const { LoginAuthError } = require("../helpers/errors");

const logoutMiddleware = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      next(new LoginAuthError("Not authorized"));
    }

    if (!token) {
      next(new LoginAuthError("Not authorized"));
    }

    const { _id } = jwt.decode(token, process.env.JWT_SECRET);
    const user = await Users.findOne({ _id, token: token });

    if (!user) {
      next(new LoginAuthError("Not authorized"));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new LoginAuthError("Please catch logout middleware"));
  }
};

module.exports = {
  logoutMiddleware,
};
