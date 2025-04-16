const express = require("express");
const authenticateUser = require("../middleware/authenticate_user");
const bookController = require("../controller/book.controller");
const authorizeRole = require("../middleware/authorize_role");
const bookRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management and borrowing operations
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of all books
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book successfully created
 */

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: query
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term for books
 *     responses:
 *       200:
 *         description: Matching books found
 */

/**
 * @swagger
 * /books/borrow/{bookId}:
 *   post:
 *     summary: Borrow a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to borrow
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 */

/**
 * @swagger
 * /books/return/{bookId}:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to return
 *     responses:
 *       200:
 *         description: Book returned successfully
 */

/**
 * @swagger
 * /books/borrow/history:
 *   get:
 *     summary: Get borrow history of the logged-in user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of borrowed books by the user
 */

/**
 * @swagger
 * /books/{bookId}:
 *   put:
 *     summary: Update book details
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: bookId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
 */

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
