const { Schema, model } = require("mongoose");

const permissionsSchema = new Schema({
  id: { type: String },
  level: { type: Number }
});

const permissions = model("permissions", permissionsSchema);

module.exports = permissions;