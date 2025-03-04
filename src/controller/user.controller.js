const CustomError = require("../error/custom_error");
const userRepo = require("../repository/user.repository");

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const userList = await userRepo.getAllUser();
      console.log(`userList`, userList);

      res.status(200).json({ data: userList });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const result = await userRepo.createUser(req.body);
      res.status(200).json({ status: "User created" });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await userRepo.findUser({ email, password });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { name, email } = req.body;
      await userRepo.updateUser({ name, email });
      res.status(200).json({ message: "user updated" });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { email } = req.body;
      await userRepo.deleteUser({ email });
      res.status(200).json({ message: "user deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
