const Author = require("../model/author.model");
const ApiError = require("../error/api_error");
const handleDbError = require("../utils/handle_db_error");

class AuthorRepository {
  constructor() {}

  /**
   * Get all authors from the database.
   * @returns {Promise<Array>} A list of all authors in the database.
   * @throws {ApiError} Throws an ApiError if a database error occurs.
   */
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

  /**
   * Create a new author in the database.
   * @param {Object} authorInfo - Information about the author to be created.
   * @param {string} authorInfo.name - Name of the author.
   * @param {string} authorInfo.email - Email of the author.
   * @param {string} authorInfo.nationality - Nationality of the author.
   * @param {string} authorInfo.dob - Date of birth of the author.
   * @returns {Promise<Object>} The newly created author object.
   * @throws {ApiError} Throws an ApiError if the author already exists or if a database error occurs.
   */
  async createAuthor(authorInfo) {
    try {
      const { name, email, nationality, dob } = authorInfo;

      const currentAuthor = await Author.findOne({ email: email });

      if (currentAuthor) {
        throw new ApiError("Author already exists", 409);
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

  /**
   * Update an existing author's details.
   * @param {Object} authorInfo - Information to update the author.
   * @param {string} authorInfo.name - Name of the author.
   * @param {string} authorInfo.email - Email of the author.
   * @param {string} authorInfo.nationality - Nationality of the author.
   * @param {string} authorInfo.dob - Date of birth of the author.
   * @returns {Promise<Object>} The result of the update operation.
   * @throws {ApiError} Throws an ApiError if the author is not found or if a database error occurs.
   */
  async updateAuthor(authorInfo) {
    try {
      const { name, email, nationality, dob } = authorInfo;

      const currentAuthor = await Author.findOne({ email: email });
      if (!currentAuthor) {
        throw new ApiError("Author not found", 404);
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

  /**
   * Delete an author from the database.
   * @param {string} authorId - The ID of the author to delete.
   * @returns {Promise<void>} Resolves once the author has been deleted.
   * @throws {ApiError} Throws an ApiError if the author is not found or if a database error occurs.
   */
  async deleteAuthor(authorId) {
    try {
      // Check if the author exists
      const currentAuthor = await Author.findById(authorId);
      if (!currentAuthor) {
        throw new ApiError("Author not found", 404);
      }

      // Delete the author
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
