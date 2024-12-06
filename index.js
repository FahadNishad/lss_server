import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contestRouter from "./routes/contest.js";
import userRouter from "./routes/userRoutes.js";
import forgotPasswordRouter from "./routes/forgetpassword.js";
import businessRoutes from "./routes/businessRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({ origin: "*" }));

// Uncomment this if specific CORS configurations are needed
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

app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});
app.use("/api/user", userRouter);
app.use("/api/business", businessRoutes);
app.use("/forgot_password", forgotPasswordRouter);
app.use("/api/contest", contestRouter);
app.use("/api/stripe", stripeRoutes);

// Start the server
const PORT = process.env.PORT || 5000; // Allow PORT to be set in the environment
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
