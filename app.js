const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const { contactsRouter } = require("./src/routers/contactsRouter");
const { authRouter } = require("./src/routers/authRouter");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const { connectMongo } = require("./src/db/connection");
const { errorHandler } = require("./src/helpers/apiHelpers");

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", authRouter);
app.use("/api/contacts", contactsRouter);
app.use(errorHandler);

const start = async () => {
  try {
    await connectMongo();

    app.listen(process.env.PORT, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  } catch (error) {
    process.exit(1);
  }
};

start();
