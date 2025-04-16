const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

/**
 * Middleware to authenticate the user by verifying the JWT token.
 * 
 * The function checks if a valid token is provided in the request header, verifies the token,
 * and checks if the user exists in the database. If authentication is successful, it adds 
 * the user information to the `req.user` object and calls `next()`. Otherwise, it sends 
 * an appropriate error response.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * @returns {void} Calls `next()` if authentication is successful, or sends an error response.
 * @throws {Object} Returns a JSON error response with status codes 401 (Unauthorized) or 403 (Forbidden) 
 */
const authenticateUser = async function (req, res, next) {
  const authHeader = req.headers;

  const token = authHeader && authHeader?.authorization?.split(" ")[1];
  console.log(`token : ${token}`);

  if (!token) {
    return res.status(403).json({ message: "Access Denied" });
  }

  let verifiedResult;
  try {
    verifiedResult = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const authorizedUser = await User.findById(verifiedResult.userId);

  if (!authorizedUser) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = authorizedUser; // setting user object in request object

  next();
};

module.exports = authenticateUser;
