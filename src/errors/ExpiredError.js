class ExpiredError extends Error {
  constructor(message) {
    super(message);
    this.name = "Expired";
    this.status = 410;
  }
}

module.exports = ExpiredError;
