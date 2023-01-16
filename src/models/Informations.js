const { Schema, model } = require("mongoose");

const informationsSchema = new Schema({
  id: { type: String },
  name: { type: String }
});

const information = model("informations", informationsSchema);

module.exports = information;