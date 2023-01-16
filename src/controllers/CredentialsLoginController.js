const Credential = require("../models/Credentials");
const CredentialsController = require("./CredentialsController");



class CredentialsLoginController extends CredentialsController {
  constructor(email, password) {
    super();
    this.email = email;
    this.password = password;
  }

  comparePassword = async () => {
    try {
    } catch (error) {}
  };

  existsEmail = async () => {
    try {
    } catch (error) {}
  };

  emailValidated = async () => {
    try {
    } catch (error) {}
  };
}

module.exports = CredentialsLoginController;
