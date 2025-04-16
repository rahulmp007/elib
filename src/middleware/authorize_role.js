/**
 * Middleware to authorize the user's role for access control.
 * 
 * This function checks if the user's role (set in `req.user.role`) is included in 
 * the provided `role` argument. If the user does not have the required role, it 
 * sends a 403 error response. If the user is authorized, it proceeds to the next middleware.
 * 
 * @param {Array|string} role - The role(s) required for access. Can be a single role string or an array of roles.
 * @returns {Function} The middleware function to be used in Express routes.
 * @throws {Object} Returns a JSON error response with status code 403 if the user does not have sufficient permissions.
 */
const authorizeRole = function (role) {
  return (req, res, next) => {
    if (!Array.from(role).includes(req.user.role)) {
      res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

module.exports = authorizeRole;
