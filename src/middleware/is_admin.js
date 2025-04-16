/**
 * Middleware to check if the user has an "admin" role.
 *
 * This function checks if the user's role (set in `req.user.role`) is "admin".
 * If the user does not have the "admin" role, it sends a 403 error response.
 * If the user is an admin, it proceeds to the next middleware or route handler.
 *
 * @param {Object} req - The Express request object containing the user's information in `req.user`.
 * @param {Object} res - The Express response object used to send a JSON error response if the user is not an admin.
 * @param {Function} next - The next middleware function to call if the user is an admin.
 * @returns {void} Calls `next()` if the user is an admin, otherwise sends a 403 error response.
 * @throws {Object} Returns a JSON error response with status code 403 if the user does not have the "admin" role.
 */
const isAdmin = (req, res, next) => {
  console.log(`req.user.role => ${req.user.role}`);

  if (req.user.role != "admin") {
    res.status(403).json({ message: "Access denied! Only admin access" });
  }
  next();
};

module.exports = isAdmin;
