const express = require("express");
const authenticateUser = require("../middleware/authenticate_user");
const bookController = require("../controller/book.controller");
const authorizeRole = require("../middleware/authorize_role");
const bookRouter = express.Router();

bookRouter
  .route("/")
  .get(bookController.getAll)
  .post(
    authenticateUser,
    authorizeRole(["admin", "librarian"]),
    bookController.createBook
  );

bookRouter.route("/search").get(authenticateUser, bookController.searchBook);
bookRouter
  .route("/borrow/:bookId")
  .post(authenticateUser, bookController.borrowBook);
bookRouter
  .route("/return/:bookId")
  .post(authenticateUser, bookController.returnBook);
bookRouter
  .route("/borrow/history")
  .get(authenticateUser, bookController.borrowHistory);

bookRouter
  .route("/:bookId")
  .put(
    authenticateUser,
    authorizeRole(["admin", "librarian"]),
    bookController.updateBook
  )
  .delete(
    authenticateUser,
    authorizeRole(["admin", "librarian"]),
    bookController.deleteBook
  );

module.exports = bookRouter;
