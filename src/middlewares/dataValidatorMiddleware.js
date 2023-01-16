const CredentialsRegisterController = require("../controllers/CredentialsRegisterController");
const DataConflictError = require("../errors/DataConflictError");
const InvalidDataError = require("../errors/InvalidDataError");


//Dividir middlewares complexos em pequenos middlewares

const emptyBodyVerify = (req, res, next) => {
  if (req.body == null) {
    return next(new InvalidDataError("Body cannot be empty"));
  }
  return next();
};

const emailAndPasswordValidator = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return next(new InvalidDataError("Email cannot be empty"));
    }
    if (!password) {
      return next(new InvalidDataErrorError("Password cannot be empty"));
    }

    const credentialsController = new CredentialsRegisterController(
      email,
      password
    );

    if (!credentialsController.emailFormatIsValid()) {
      return next(new InvalidDataErrorError("Email format invalid"));
    }
    if (!credentialsController.passwordFormatIsValid()) {
      return next(new InvalidDataErrorError("Password format invalid"));
    }

    if (await credentialsController.existsEmail()) {
      return next(new DataConflictError("Email alredy in use"));
    }

    req.credentialsController = credentialsController;

    next();
  } catch (error) {
    next(error);
  }
};

const emailAndCodeValidator = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email) {
      return next(new InvalidDataError("Email cannot be empty"));
    }
    if (!code) {
      return next(new InvalidDataErrorError("Code cannot be empty"));
    }

    req.body.code = code.replace(" ", "");

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  emptyBodyVerify,
  emailAndPasswordValidator,
  emailAndCodeValidator,
};
