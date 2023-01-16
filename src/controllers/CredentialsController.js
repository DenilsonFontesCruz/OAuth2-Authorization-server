const Credential = require("../models/Credentials");

class CredentialsController {
  static findById = async (credentialsID) => {
    try {
      return await Credential.findById(credentialsID);
    } catch (error) {
      throw error;
    }
  };

  static findByEmail = async (email) => {
    try {
      return await Credential.findOne({ email });
    } catch (error) {
      throw error;
    }
  };

}

module.exports = CredentialsController;
