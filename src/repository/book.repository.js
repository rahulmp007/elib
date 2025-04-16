const Book = require("../model/book.model");
const ApiError = require("../error/api_error");
const handleDbError = require("../utils/handle_db_error");
const User = require("../model/user.model");
const mongoose = require("mongoose");

class BookRepository {
  constructor() {}

  /**
   * Get all books from the database.
   * @returns {Promise<Array>} List of all books in the database.
   * @throws {ApiError} Throws an ApiError if a database error occurs.
   */
  async getAllBooks() {
    try {
      return await Book.find({});
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }

  /**
   * Create a new book in the database.
   * @param {Object} bookInfo - Information for the new book.
   * @param {string} bookInfo.title - The title of the book.
   * @param {string} bookInfo.author - The author of the book.
   * @param {string} bookInfo.genre - The genre of the book.
   * @param {number} bookInfo.year - The publication year of the book.
   * @returns {Promise<Object>} The newly created book object.
   * @throws {ApiError} Throws an ApiError if a database error occurs.
   */
  async createBook(bookInfo) {
    console.log("creating book");
    try {
      const book = new Book(bookInfo);
      return await book.save();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }

  /**
   * Update an existing book's information.
   * @param {Object} bookInfo - Information to update the book.
   * @returns {Promise<Object>} The result of the update operation.
   * @throws {ApiError} Throws an ApiError if the book is not found or a database error occurs.
   */
  async updateBook() {
    // Placeholder for future method implementation
  }

  /**
   * Delete a book from the database.
   * @param {string} bookId - The ID of the book to delete.
   * @returns {Promise<Object>} The result of the delete operation.
   * @throws {ApiError} Throws an ApiError if the book is not found or a database error occurs.
   */
  async deleteBook() {
    // Placeholder for future method implementation
  }

  /**
   * Search for books based on a query (e.g., by title).
   * @param {string} query - The search query, typically the title of the book.
   * @returns {Promise<Array>} List of books that match the search query.
   * @throws {ApiError} Throws an ApiError if a database error occurs.
   */
  async search(query) {
    try {
      const searchResult = await Book.find({ title: query });
      return searchResult;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }

  /**
   * Borrow a book for a user.
   * @param {string} userId - The ID of the user borrowing the book.
   * @param {string} bookId - The ID of the book being borrowed.
   * @returns {Promise<void>} Resolves once the book has been borrowed successfully.
   * @throws {ApiError} Throws an ApiError if the book or user is not found, or if the user has already borrowed the book.
   */
  async borrowBook(userId, bookId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new ApiError("Invalid id format", 400);
      }

      const borrowedBook = await Book.findById(bookId);

      if (!borrowedBook) {
        throw new ApiError("Book not found", 404);
      }

      const hasBookReturned = borrowedBook.isReturned;

      if (borrowedBook && !hasBookReturned) {
        throw new ApiError(
          "You have already borrowed this book. Please return it before borrowing again",
          400
        );
      }

      const currentUser = await User.findById(userId);
      const currentBorrowInfo = currentUser.borrowed;
      const borrowedDate = new Date().toISOString();

      const borrowInfo = {
        bookId: bookId,
        borrowedDate: borrowedDate,
      };

      if (!Array.isArray(currentUser.borrowed)) {
        currentUser.borrowed = [];
      }

      currentUser.borrowed.unshift(borrowInfo);
      await currentUser.save();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }

  /**
   * Return a borrowed book.
   * @param {string} userId - The ID of the user returning the book.
   * @param {string} bookId - The ID of the book being returned.
   * @returns {Promise<void>} Resolves once the book has been returned successfully.
   * @throws {ApiError} Throws an ApiError if the user or book is not found, or if the book hasn't been borrowed.
   */
  async returnBook(userId, bookId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new ApiError("invalid id format", 400);
      }

      const currentUser = await User.findById(userId);

      const currentBook = currentUser.borrowed.find(
        (item) => item.bookId == bookId
      );
      if (!currentBook) {
        throw new ApiError("book not found", 404);
      }
      currentBook.isReturned = true;
      currentBook.returnedDate = new Date();

      await currentUser.save();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }

  /**
   * Get the borrowing history of a user.
   * @param {string} userId - The ID of the user whose borrowing history is to be retrieved.
   * @returns {Promise<Array>} A list of borrowed books with details.
   * @throws {ApiError} Throws an ApiError if the user is not found or if the ID format is invalid.
   */
  async borrowHistory(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError("Bad request, invalid id", 400);
      }
      const user = await User.findById(userId).populate("borrowed.bookId");
      return user.borrowed;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw handleDbError(error);
      }
    }
  }
}

module.exports = new BookRepository();
