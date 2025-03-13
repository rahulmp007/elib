const mongoose = require("mongoose");
const handleDbError = require("../utils/handle_db_error");

const connectDb = async () => {
  try {
    const DB_PATH = process.env.DB_URL;
    const DB_NAME = process.env.DB_NAME;
    const path = `${DB_PATH}/${DB_NAME}`;
    const MONGO_URI = process.env.MONGO_URI;
    const connectResult = await mongoose.connect(MONGO_URI);
    console.log("Database Connection Successfull");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    throw handleDbError(error);
    // process.exit(1);
  }
};

module.exports = connectDb;
