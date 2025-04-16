/**
 * Custom error class for handling application-specific errors.
 * 
 * This class extends the built-in `Error` class to provide additional properties 
 * such as `statusCode` and `type`. It also captures the stack trace for debugging purposes.
 * 
 * @class
 * @extends {Error}
 */
class CustomError extends Error {
  /**
   * Creates an instance of the CustomError class.
   * 
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code associated with the error.
   * @param {string} type - A custom type for categorizing the error (e.g., 'validation', 'database', etc.).
   */
  constructor(message, statusCode, type) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
