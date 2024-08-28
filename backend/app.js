"use strict";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload"); // Add file upload middleware

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const artistRoutes = require("./routes/artists"); // Update this line to match the new file name

const { NotFoundError } = require("./expressError");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// Enable file upload
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
    createParentPath: true,
}));

// Apply the authenticateJWT middleware only to routes that require authentication
app.use("/api/users", authenticateJWT, userRoutes);
app.use("/api/artists", authenticateJWT, artistRoutes); // Updated path

// Public routes that do not require authentication
app.use("/api/auth", authRoutes);

// Handle 404 errors
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

// General error handler
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status }
  });
});

module.exports = app;