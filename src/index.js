const app = require("./app");
const dotenv = require("dotenv");
const connectDb = require("./database/db");
dotenv.config({ path: "./src/.env" });

const PORT = process.env.PORT;

connectDb()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {});
