const express = require("express");
const app = express();

const logRequest = require("./middleware/log_request");
const userRouter = require("./routes/user.route");
const handlerError = require("./middleware/error_handler");
const authorizeUser = require("./middleware/authorize_user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequest);


app.use("/api/v1/user", userRouter);

app.use(handlerError);

module.exports = app;
