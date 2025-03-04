const CustomError = require("../error/custom_error");

class ApiError extends CustomError {
  constructor(message, statusCode) {
    super(message, statusCode, "API_ERROR");
  }
}

module.exports = ApiError;
