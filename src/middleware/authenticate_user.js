const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

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
  console.log(authorizedUser);

  if (!authorizedUser) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = authorizedUser; // setting user object in request object

  next();
};

module.exports = authenticateUser;
