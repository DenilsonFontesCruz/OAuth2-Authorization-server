const bCrypt = require("bcrypt");
const RedisController = require("./RedisController");
const EmailController = require("./EmailController");
const CredentialsLoginController = require("./CredentialsLoginController");
const ExpiredError = require("../errors/ExpiredError");

class EmailAuthenticateController {
  constructor(email) {
    this.email = email;
  }

  validateCode = async () => {
    try {
      const code = await this.generateRandomCode();
      const redisEmailController = new RedisController(
        "EmailAuthentication",
        this.email
      );
      await redisEmailController.addValue(code, 60);
      this.sendEmail(code);
    } catch (error) {
      throw error;
    }
  };

  generateRandomCode = () => {
    const code = Math.floor(Math.random() * (999999 - 100000) + 100000);
    return code.toString();
  };

  verifyCode = async (code) => {
    try {
      const redisEmailController = new RedisController(
        "EmailAuthentication",
        this.email
      );
      if (!(await redisEmailController.existsKey())) {
        throw new ExpiredError("Code expired, new code sent");
      }
      const correctCode = await redisEmailController.findValue();
      return correctCode === code;
    } catch (error) {
      throw error;
    }
  };

  sendEmail = async (code) => {
    try {
      await EmailController.sendAuthenticateEmail(this.email, code);
    } catch (error) {
      throw error;
    }
  };
}

module.exports = EmailAuthenticateController;
