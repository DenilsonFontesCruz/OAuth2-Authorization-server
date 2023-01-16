const mongoose = require("mongoose");
const { MONGO_DATABASE_URL } = process.env;

const connect = async () => {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(MONGO_DATABASE_URL);

    console.log(`Mongo Database connection successful`);
  } catch (error) {
    console.error(`\x1b[31mMongo Database connection error`);
    throw error;
  }
};

module.exports = connect;
