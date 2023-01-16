const { client } = require("../database/redisDB");

class RedisController {
  constructor(prefix, email) {
    this.prefix = prefix;
    this.email = email;
  }

  addValue = async (code, expireTime) => {
    client.setEx(`${this.prefix}-${this.email}`, expireTime, code);
  };

  findValue = async () => {
    return await client.get(`${this.prefix}-${this.email}`);
  };

  existsKey = async () => {
    return await client.exists(`${this.prefix}-${this.email}`);
  };
}

module.exports = RedisController;
