const authorizeRole = function (role) {
  return (req, res, next) => {

    if (req.user.role) {
        
    }
    next();
  };
};

module.exports = authorizeRole;
