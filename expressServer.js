// const { Middleware } = require('swagger-express-middleware');
const http = require("http");
const fs = require("fs");
const path = require("path");
const swaggerUI = require("swagger-ui-express");
const jsYaml = require("js-yaml");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const OpenApiValidator = require("express-openapi-validator");
const logger = require("./logger");
const config = require("./config");
const database = require("./database");

class ExpressServer {
  constructor(port, openApiYaml, database) {
    this.port = port;
    this.app = express();
    this.openApiPath = openApiYaml;
    this.database = database;

    try {
      this.schema = jsYaml.load(fs.readFileSync(openApiYaml));
    } catch (e) {
      logger.error("failed to start Express Server", e.message);
    }
    this.setupMiddleware();
  }

  setupMiddleware() {
    // this.setupAllowedMedia();
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: "14MB" }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    if (process.env.NODE_ENV !== "production") {
      this.app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(this.schema));
    }
  }

  prepareExpress() {
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: this.openApiPath,
        operationHandlers: path.join(__dirname),
        fileUploader: { dest: config.FILE_UPLOAD_PATH },
      })
    );
  }

  async launch() {
    //database connection
    await this.database.connect();
    this.prepareExpress();
    // eslint-disable-next-line no-unused-vars
    this.app.use((err, req, res, next) => {
      // format errors
      logger.error("error occured:", err);
      res.status(err.status || 500).json({
        message: err.message || err,
        errors: err.errors || "",
      });
    });

    http.createServer(this.app).listen(this.port);
    logger.info(`Listening on port ${this.port}`);
  }

  async close() {
    if (this.server !== undefined) {
      await this.server.close();
      logger.info(`Server on port ${this.port} shut down`);
    }
  }
}

module.exports = ExpressServer;
