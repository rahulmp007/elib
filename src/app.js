const express = require("express");
const app = express();

const logRequest = require("./middleware/log_request");
const userRouter = require("./routes/user.route");
const handlerError = require("./middleware/error_handler");
const bookRouter = require("./routes/book_route");
const authorRouter = require("./routes/author.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequest);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/author", authorRouter);

app.use(handlerError);

module.exports = app;
