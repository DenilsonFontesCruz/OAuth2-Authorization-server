const CredentialsLoginController = require("../Controllers/CredentialsLoginController");
const CredentialsRegisterController = require("../Controllers/CredentialsRegisterController");
const EmailAuthenticateController = require("../controllers/EmailauthenticateController");
const DatabaseQueryError = require("../errors/DatabaseQueryError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const {
  emptyBodyVerify,
  emailAndPasswordValidator,
  emailAndCodeValidator,
  codeValidation,
} = require("../middlewares/dataValidatorMiddleware");

const router = require("express").Router();

router.post(
  "/register",
  [emptyBodyVerify, emailAndPasswordValidator],
  async (req, res, next) => {
    try {
      const credentialsController = req.credentialsController;
      const credential = await credentialsController.createCredentials();
      if (!credential) {
        next(new DatabaseQueryError("Credentials register error"));
      }

      const emailAuth = new EmailAuthenticateController(credential.email);

      await emailAuth.validateCode();

      res.send("Successfully registered");
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/email_authentication",
  [emptyBodyVerify, emailAndCodeValidator],
  async (req, res, next) => {
    try {
      const { email, code } = req.body;

      const emailAuth = new EmailAuthenticateController(email);

      if (!(await emailAuth.verifyCode(code))) {
        next(new UnauthorizedError("Invalid code"));
      }

      await CredentialsRegisterController.validateEmail(email);

      res.send("Successfully validated");
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
