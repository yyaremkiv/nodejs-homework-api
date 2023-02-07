const Joi = require("joi");
const { ValidationError } = require("../helpers/errors");

module.exports = {
  addContactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string()
        .regex(/^\+?[0-9]+$/)
        .min(10)
        .max(15)
        .required(),
      favorite: Joi.boolean(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      next(new ValidationError(validationResult.error.message));
    }
    next();
  },

  updateContactStatusValidation: (req, res, next) => {
    const schema = Joi.object({
      favorite: Joi.boolean().required(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      next(new ValidationError(validationResult.error.message));
    }
    next();
  },

  signValidation: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(16).required(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      next(new ValidationError(validationResult.error.message));
    }
    next();
  },
};
