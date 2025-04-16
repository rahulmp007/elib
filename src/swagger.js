const swaggerDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Library API",
      version: "1.0.0",
      description: "API docs for E-Library platform",
    },
    servers: [
      {
        url: "http://localhost:4646",
      }
    
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerOptions = swaggerDoc(options);

module.exports = swaggerOptions;
