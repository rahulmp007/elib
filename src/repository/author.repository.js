const Author = require("../model/author.model");
const ApiError = require("../error/api_error");
const handleDbError = require("../utils/handle_db_error");

class AuthorRepository {
  constructor() {}

  async getAuthors() {
    try {
      return await Author.find({});
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }
  async createAuthor(authorInfo) {
    try {
      const { name, email, nationality, dob } = authorInfo;

      const currentAuthor = await Author.findOne({ email: email });

      if (currentAuthor) {
        throw new ApiError("Author already exsits", 409);
      }

      const newAuthor = new Author({ name, email, nationality, dob });
      return await newAuthor.save();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }
  async updateAuthor(authorInfo) {
    try {
      const { name, email, nationality, dob } = authorInfo;

      const currentAuthor = await Author.findOne({ email: email });
      if (!currentAuthor) {
        throw new ApiError("user not found", 404);
      }

      return await Author.updateOne(
        { email: email },
        { $set: { name: name, nationality: nationality, dob: dob } }
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }
  async deleteAuthor(authorId) {
    try {
      // check if the author has books if not delete
      const currentAuthor = await Author.findById(authorId);
      if (!currentAuthor) {
        throw new ApiError("user not found", 404);
      }
      await Author.findByIdAndDelete(authorId);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }
}

module.exports = new AuthorRepository();
