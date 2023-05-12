const express = require("express");
const app = express();

// body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// api routes
app.use("/api", require("./api"));

// Send 404 for any remaining requests
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

module.exports = app;