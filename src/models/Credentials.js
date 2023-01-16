const { Schema, model } = require("mongoose");

const credentialSchema = new Schema({
  id: { type: String },
  email: { type: String },
  password: { type: String },
  emailValidated: { type: Boolean },
  informations: {
    type: Schema.Types.ObjectId,
    ref: "informations",
  },
  permissions: {
    type: Schema.Types.ObjectId,
    ref: "permissions",
  }
});

const credential = model("credentials", credentialSchema);

module.exports = credential;