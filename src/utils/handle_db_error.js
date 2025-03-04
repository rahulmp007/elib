const CustomError = require("../error/custom_error");
const DbError = require("../error/db_error");

const handleDbError = (error) => {
  console.error(`Database Error => ${error.name}`);

  const dbErrorCode =
    error.code || error.cause?.code || error.originalError?.code;

  const errObj = error || error.cause || error.originalError;

  let statusCode = 500;
  let message;

  // Handle Duplicate Key Error (MongoDB)

  if (error.name == "MongoNetworkError") {
    return new DbError("Database connection failed", 500);
  } else if (dbErrorCode === 11000) {
    const keys = Object.keys(errObj.cause.keyPattern);
    message = `Duplicate value for field: ${keys.join(", ")}`;
    return new DbError(message, 400);
  }

  // Handle Validation Errors (Mongoose)
  // if (error.name === "ValidationError") {
  //   const messages = Object.values(error.errors)
  //     .map((err) => err.message)
  //     .join(", ");
  //   return new CustomError(messages, 400);
  // }

  // // Handle Cast Errors (Invalid ObjectId or incorrect field type)
  // if (error.name === "CastError") {
  //   const message = `Invalid value for field '${error.path}': ${error.value}`;
  //   return new CustomError(message, 400);
  // }

  // // Handle Other Mongoose Errors
  // if (error.name === "MongoNetworkError") {
  //   return new CustomError("Database connection failed", 500);
  // }

  // if (error.name === "MongoTimeoutError") {
  //   return new CustomError("Database request timed out", 500);
  // }

  // If it's an unknown database error, return a generic error
  return new CustomError("Database operation failed", 500);
};

module.exports = handleDbError;
