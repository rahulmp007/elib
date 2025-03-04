const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must not be empty"],
    },
    email: {
      type: String,
      required: [true, "Email must not be empty"],
      unique: [true, "A user with corresponding email is already exists"],
    },
    password: {
      type: String,
      required: [true, "Password must not be empty"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "librarian"],
      default: "user",
    },
    borrowed: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
        borrowedDate: { type: Date, default: Date.now },
        returnedDate: {
          type: Date,
          default: Date.now,
        },
        isReturned: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
