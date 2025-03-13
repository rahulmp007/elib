const authorRepo = require("../repository/author.repository");

class AuthorController {
  constructor() {}

  async getAuthors(req, res, next) {
    try {
      const authors = await authorRepo.getAuthors();
      res.status(200).json({ status: "success", data: authors });
    } catch (error) {
      next(error);
    }
  }
  async createAuthor(req, res, next) {
    try {
      const { name, email, nationality, dob } = req.body;
      await authorRepo.createAuthor({ name, email, nationality, dob });
      res.status(201).json({ status: "success", message: "Author created" });
    } catch (error) {
      next(error);
    }
  }
  async updateAuthor(req, res, next) {
    try {
      const { name, email, nationality, dob } = req.body;
      await authorRepo.updateAuthor({ name, email, nationality, dob });
      res.status(200).json({ message: "Author updated" });
    } catch (error) {
      next(error);
    }
  }
  async deleteAuthor(req, res, next) {
    const authorId = req.params.authorId;

    try {
      await authorRepo.deleteAuthor(authorId);
      res.status(200).json({ message: "Author deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthorController();
