const isAdmin = (req, res, next) => {
  console.log(`req.user.role => ${req.user.role}`);

  if (req.user.role != "admin") {
    res.status(403).json({ messaage: "Access denied!.Only admin access" });
  }
  next();
};

module.exports = isAdmin;
