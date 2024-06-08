"use strict";

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3001;

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/task", taskRoute);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = { server, app };
