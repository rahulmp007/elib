const express = require("express");
const authenticateUser = require("../middleware/authenticate_user");
const isAdmin = require("../middleware/is_admin");
const authorController = require("../controller/author.controller");
const authorRouter = express.Router();

authorRouter
  .route("/")
  .get(authenticateUser, isAdmin, authorController.getAuthors)
  .post(authenticateUser, isAdmin, authorController.createAuthor)
  .put(authenticateUser, isAdmin, authorController.updateAuthor);

authorRouter
  .route("/:authorId")
  .delete(authenticateUser, isAdmin, authorController.deleteAuthor);

module.exports = authorRouter;
