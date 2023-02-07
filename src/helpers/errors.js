class Nodels26Error extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class ValidationError extends Nodels26Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class WrongParametersError extends Nodels26Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class LoginAuthError extends Nodels26Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

class RegistrationConflictError extends Nodels26Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

module.exports = {
  Nodels26Error,
  ValidationError,
  WrongParametersError,
  RegistrationConflictError,
  LoginAuthError,
};
