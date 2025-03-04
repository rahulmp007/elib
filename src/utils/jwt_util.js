const jwt = require("jsonwebtoken");

const generateToken = async (userId) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ userId }, secret, { expiresIn: "24hr" });
};

module.exports = generateToken;
