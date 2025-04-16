const express = require("express");
const authenticateUser = require("../middleware/authenticate_user");
const isAdmin = require("../middleware/is_admin");
const authorController = require("../controller/author.controller");
const authorRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Manage authors (Admin only)
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all authors
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Author created successfully
 *   put:
 *     summary: Update an author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Author updated successfully
 */

/**
 * @swagger
 * /authors/{authorId}:
 *   delete:
 *     summary: Delete an author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: authorId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the author to delete
 *     responses:
 *       200:
 *         description: Author deleted successfully
 */

authorRouter
  .route("/")
  .get(authenticateUser, isAdmin, authorController.getAuthors)
  .post(authenticateUser, isAdmin, authorController.createAuthor)
  .put(authenticateUser, isAdmin, authorController.updateAuthor);

authorRouter
  .route("/:authorId")
  .delete(authenticateUser, isAdmin, authorController.deleteAuthor);

module.exports = authorRouter;
