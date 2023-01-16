const bCrypt = require("bcrypt");
const DataConflictError = require("../errors/DataConflictError");
const NotFoundError = require("../errors/NotFoundError");
const { findOne } = require("../models/Credentials");
const Credential = require("../models/Credentials");
const CredentialsController = require("./CredentialsController");

//Colocar funções basicas no CredentialsController, passar todas as funções de authorização para um unico controlador

class CredentialsRegisterController extends CredentialsController {
  constructor(email, password) {
    super();
    this.email = email;
    this.password = password;
  }

  passwordFormatIsValid = () => {
    const regex = new RegExp(
      "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,32}$"
    );
    return regex.test(this.password);
  };

  encryptPassword = async () => {
    try {
      return await bCrypt.hash(this.password, +process.env.SALT_ROUNDS);
    } catch (error) {
      throw error;
    }
  };

  emailFormatIsValid = () => {
    const regex = new RegExp(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
    );
    return regex.test(this.email);
  };

  existsEmail = async () => {
    try {
      if (await Credential.exists({ email: this.email })) {
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  createCredentials = async () => {
    try {
      const password = await this.encryptPassword();

      const credentials = new Credential({
        email: this.email,
        emailValidated: false,
        password: password,
      });

      return await credentials.save();
    } catch (error) {
      throw error;
    }
  };

  static validateEmail = async (email) => {
    try {
      const credentials = await this.findByEmail(email);

      if (!credentials) {
        throw new NotFoundError("Email not registered");
      }

      if (credentials.emailValidated) {
        throw new DataConflictError("Email already verified");
      }

      credentials.emailValidated = true;
      await credentials.save();
    } catch (error) {
      throw error;
    }
  };
}

module.exports = CredentialsRegisterController;
