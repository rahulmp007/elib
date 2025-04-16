const express = require("express");
const userController = require("../controller/user.controller");
const authenticateUser = require("../middleware/authenticate_user");
const isAdmin = require("../middleware/is_admin");
const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *   put:
 *     summary: Update a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

userRouter
  .route("/")
  .get(authenticateUser, isAdmin, userController.getAllUsers)
  .post(userController.createUser)
  .put(authenticateUser, isAdmin, userController.updateUser)
  .delete(authenticateUser, isAdmin, userController.deleteUser);

userRouter.route("/login").post(userController.login);

module.exports = userRouter;
