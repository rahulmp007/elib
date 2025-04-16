const User = require("../model/user.model");
const handleDbError = require("../utils/handle_db_error");
const ApiError = require("../error/api_error");
const generateToken = require("../utils/jwt_util");

class UserRepository {
  /**
   * Get all users from the database.
   * @returns {Promise<Array>} List of users without passwords.
   * @throws {ApiError} Throws an ApiError if a database error occurs.
   */
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

  /**
   * Create a new user in the database.
   * @param {Object} userInfo - Information for the new user.
   * @param {string} userInfo.name - Name of the user.
   * @param {string} userInfo.email - Email of the user.
   * @param {string} userInfo.password - Password of the user.
   * @param {string} userInfo.role - Role of the user.
   * @returns {Promise<Object>} The newly created user object.
   * @throws {ApiError} Throws an ApiError if the user already exists or if a database error occurs.
   */
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

  /**
   * Update an existing user's information.
   * @param {Object} userInfo - Information for the user update.
   * @param {string} userInfo.name - Updated name of the user.
   * @param {string} userInfo.email - Email of the user to update.
   * @returns {Promise<Object>} The result of the update operation.
   * @throws {ApiError} Throws an ApiError if the user is not found or if a database error occurs.
   */
  async updateUser(userInfo) {
    try {
      const { name, email } = userInfo;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new ApiError("user not found", 404);
      }

      return await User.updateOne({ email: email }, { $set: { name: name } });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }

  /**
   * Delete a user from the database.
   * @param {Object} userInfo - Information to identify the user.
   * @param {string} userInfo.email - Email of the user to be deleted.
   * @returns {Promise<Object>} The result of the delete operation.
   * @throws {ApiError} Throws an ApiError if the user is not found or if a database error occurs.
   */
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

  /**
   * Find a user by email and password, and generate a token if valid.
   * @param {Object} userInfo - Information for user authentication.
   * @param {string} userInfo.email - Email of the user.
   * @param {string} userInfo.password - Password of the user.
   * @returns {Promise<Object>} An object containing a JWT token and the user data (without password).
   * @throws {ApiError} Throws an ApiError if the user is not found or credentials are invalid.
   */
  async findUser(userInfo) {
    try {
      const { email, password } = userInfo;
      const existingUser = await User.findOne({ email }).select("-borrowed");

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
