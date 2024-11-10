const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const app = express();

// CORS configuration
app.use(cors({ origin: "*" }));

// // CORS configuration
// app.use(cors({
//   origin: 'http://localhost:3000', // Replace with your frontend URL
//   credentials: true, // Allow credentials (cookies, etc.)
// }));

app.use(express.json()); // Middleware to parse JSON bodies

// MongoDB connection
const mongoURI = process.env.MONGODB_URI; // Use environment variable for MongoDB URI
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Route handlers
const registerRouter = require("./routes/register");
app.use("/register", registerRouter);

const loginRouter = require("./routes/login");
app.use("/login", loginRouter);

const forgotPasswordRouter = require("./routes/forgetpassword"); // Ensure the filename matches
app.use("/forgot_password", forgotPasswordRouter);

const contestRouter = require("./routes/contest");
app.use("/contest", contestRouter);

// Start the server
const PORT = process.env.PORT || 5000; // Allow PORT to be set in the environment
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
