require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const mongoDB = require("./src/database/mongoDB");
const redisDB = require("./src/database/redisDB");

const openRoutes = require("./src/routes/open");

async function initialize() {
  try {
    const { PORT } = process.env;

    const app = express();

    app.use(bodyParser.json());

    app.set("views", "./src/views/");
    app.set("view engine", "ejs");

    app.use(openRoutes);

    await mongoDB();

    await redisDB.connect();

    app.listen(PORT, (e) => {
      console.log(`Server running on\x1b[35m http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Server initialize error:`, error);
  }
}

initialize();
