const express = require("express");
const userController = require("../controller/user.controller");
const authenticateUser = require("../middleware/authenticate_user");
const isAdmin = require("../middleware/is_admin");
const userRouter = express.Router();

userRouter
  .route("/")
  .get(authenticateUser, isAdmin, userController.getAllUsers)
  .post(userController.createUser)
  .put(authenticateUser, isAdmin, userController.updateUser)
  .delete(authenticateUser, isAdmin, userController.deleteUser);

userRouter.route("/login").post(userController.login);

module.exports = userRouter;
