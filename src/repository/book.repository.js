const Book = require("../model/book.model");
const ApiError = require("../error/api_error");
const handleDbError = require("../utils/handle_db_error");
const User = require("../model/user.model");
const mongoose = require("mongoose");

class BookRepository {
  constructor() {}

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
  async updateBook() {}
  async deleteBook() {}

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
  async returnBook(userId, bookId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        throw new ApiError("invalid id format", 400);
      }

      const currentUser = await User.findById(userId);

      console.log(currentUser);

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

  async borrowHistory(userId) {
    console.log(`userId -- ${userId}`);

    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError("Bad request, invalid id", 400);
      }
      const user = await User.findById(userId).populate("borrowed.bookId");
      console.log(user);

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
