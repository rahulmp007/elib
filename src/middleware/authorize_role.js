const authorizeRole = function (role) {
  return (req, res, next) => {
    if (!Array.from(role).includes(req.user.role)) {
      res
        .status(403)
        .json({ mesage: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

module.exports = authorizeRole;
