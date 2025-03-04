const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book must have a title"],
    },

    authorId: {
      ref: "Author",
      type: mongoose.Schema.Types.ObjectId,
    },
    publishedOn: {
      type: Date,
      required: [true, "Published date cannot be empty"],
    },
    genre: {
      type: String,
    },
    availableCopies: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
