const User = require("../model/user.model");
const handleDbError = require("../utils/handle_db_error");
const ApiError = require("../error/api_error");
const generateToken = require("../utils/jwt_util");

class UserRepository {
  constructor() {}

  async getAllUser() {
    try {
      return await User.find({}).select("-password");
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }
  async createUser(userInfo) {
    try {
      const { name, email, password, role } = userInfo;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new ApiError("User already exists", 409);
      }

      const newUser = new User({ name, email, password, role });
      return await newUser.save();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }
  async updateUser(userInfo) {
    try {
      const { name, email } = userInfo;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new ApiError("user not found", 404);
      }

      return await User.updateOne({ email: email }, { $set: { name: name } });

      // can also use REPLACEONE which reutrn current updated document
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }
  async deleteUser(userInfo) {
    try {
      const { email } = userInfo;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new ApiError("user not found", 404);
      }
      return await User.deleteOne({ email });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }

  async findUser(userInfo) {
    try {
      const { email, password } = userInfo;
      const existingUser = await User.findOne({ email }).select('-borrowed')
      // .populate("borrowed.bookId");
      if (!existingUser) {
        throw new ApiError("No such user exists", 404);
      }

      const isValidPassword = await existingUser.comparePassword(password);

      if (!isValidPassword) {
        throw new ApiError("Invalid credentials", 401);
      }

      const token = await generateToken(existingUser._id);

      delete existingUser._doc.password;
      return { token: token, data: { ...existingUser._doc } };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }
}

module.exports = new UserRepository();
