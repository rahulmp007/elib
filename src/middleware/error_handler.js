const CustomError = require("../error/custom_error");

const handlerError = (err, req, res, next) => {
  console.log(`Error Handler :=> ${err}`);

  const type = err.type;
  const message = err.message;
  const code = err.code || err.statusCode;

  if (type == "DB_ERROR") {
    res.status(500).json({ message: message });
  }
  if (type == "API_ERROR") {
    res.status(code).json({ message: message });
  }

  next();
};

module.exports = handlerError;
