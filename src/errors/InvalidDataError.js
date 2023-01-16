class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidData";
    this.status = 400;
  }
}

module.exports = InvalidDataError;
