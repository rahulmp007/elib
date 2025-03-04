const express = require("express");
const userController = require("../controller/user.controller");
const authorizeUser = require("../middleware/authorize_user");

const userRouter = express.Router();

userRouter
  .route("/")
  .get(authorizeUser, userController.getAllUsers)
  .post(userController.createUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

userRouter.route("/login").post(userController.login);

module.exports = userRouter;
