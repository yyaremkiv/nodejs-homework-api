const { Nodels26Error, RegistrationConflictError } = require("./errors");

const asyncWrapper = (controller) => {
  return (req, res, next) => {
    controller(req, res).catch(next);
  };
};

const errorHandler = (error, req, res, next) => {
  if (error instanceof RegistrationConflictError) {
    return res.status(error.status).json({ message: error.message });
  }
  if (error instanceof Nodels26Error) {
    return res.status(error.status).json({ message: error.message });
  }
  res.status(500).json({ message: error.message });
};

module.exports = {
  asyncWrapper,
  errorHandler,
};
