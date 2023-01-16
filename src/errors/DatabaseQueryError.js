class DatabaseQueryError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseQuery";
    this.status = 500;
  }
}

module.exports = DatabaseQueryError;
