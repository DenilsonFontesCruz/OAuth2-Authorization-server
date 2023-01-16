class DataConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "DataConflict";
    this.status = 409;
  }
}

module.exports = DataConflictError;
