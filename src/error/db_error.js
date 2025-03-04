const CustomError = require("../error/custom_error");


class DbError extends CustomError {
  constructor(message, statusCode) {
    super(message, statusCode, "DB_ERROR");
  }
}

module.exports = DbError;
