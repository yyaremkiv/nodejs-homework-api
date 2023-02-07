const jwt = require("jsonwebtoken");
const { Users } = require("../db/userModel");
const { LoginAuthError } = require("../helpers/errors");

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      next(new LoginAuthError("Please"));
    }

    if (!token) {
      next(new LoginAuthError("Please, provide a token!!"));
    }

    const { _id } = jwt.decode(token, process.env.JWT_SECRET);
    const user = await Users.findById({ _id });

    if (!user || user.token !== token) {
      next(new LoginAuthError("Not authorized"));
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    next(new LoginAuthError("Please, provide a token!!!!!!"));
  }
};

module.exports = {
  authMiddleware,
};
