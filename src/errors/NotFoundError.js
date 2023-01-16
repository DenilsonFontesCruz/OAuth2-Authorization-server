class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFound";
    this.status = 404;
  }
}

module.exports = NotFoundError;
