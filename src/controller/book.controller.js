const bookRepo = require("../repository/book.repository");
class BookController {
  constructor() {}

  async getAll(req, res, next) {
    try {
      const books = await bookRepo.getAllBooks();
      res.status(200).json({ message: "success", data: books });
    } catch (error) {
      next(error);
    }
  }
  async createBook(req, res, next) {
    try {
      const { title, authorId, publishedOn, genre, availableCopies } = req.body;
      await bookRepo.createBook({
        title,
        authorId,
        publishedOn,
        genre,
        availableCopies,
      });
      res.status(200).json({ status: "success", message: "Book created" });
    } catch (error) {
      next(error);
    }
  }
  async updateBook() {}
  async deleteBook() {}

  async searchBook(req, res, next) {
    try {
      const query = req.query?.q;
      console.log(`search term : ${query}`);

      const searchResult = await bookRepo.search(query);

      const result = Array.from(searchResult);

      if (result.length == 0) {
        res.status(404).json({
          status: "false",
          message: "no record found for given query",
        });
      } else {
        res.status(200).json({ status: "success", result: searchResult });
      }
    } catch (error) {
      next(error);
    }
  }

  async borrowBook(req, res, next) {
    const bookId = req.params.bookId;
    try {
      const result = await bookRepo.borrowBook(req.user.id, bookId);
      res.status(200).json({ mesage: "borrow successfull" });
    } catch (error) {
      next(error);
    }
  }
  async returnBook(req, res, next) {
    try {
      await bookRepo.returnBook(req.user.id, req.params.bookId);
      res
        .status(200)
        .json({ status: "success", message: "book return complete" });
    } catch (error) {
      next(error);
    }
  }

  async borrowHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const borrowHistory = await bookRepo.borrowHistory(userId);
      res.status(200).json({ status: "success", data: borrowHistory });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookController();
