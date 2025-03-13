const mongoose = require("mongoose");

const authorSchema = mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    nationality: {
      type: String,
    },

    dob: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Author = mongoose.model("Author", authorSchema);
module.exports = Author;
