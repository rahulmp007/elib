const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const authorizeUser = async function (req, res, next) {
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

  const isUserAuthorized = authorizedUser && authorizedUser.role == "admin";

  if (isUserAuthorized === false) {
    return res.status(401).json({ message: "Unauthorized user" });
  }
  next();
};

module.exports = authorizeUser;
