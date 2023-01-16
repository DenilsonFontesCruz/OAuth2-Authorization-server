const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_DATABASE_URL,
});

const connect = async () => {
  try {
    await client.connect();

    console.log(`Redis Database connection successful`);
  } catch (error) {
    console.error(`\x1b[31mRedis Database connection error`);
    throw error;
  }
};

module.exports = { client, connect };
