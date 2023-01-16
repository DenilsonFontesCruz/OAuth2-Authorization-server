class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "Unauthorized";
    this.status = 401;
  }
}

module.exports = UnauthorizedError;
