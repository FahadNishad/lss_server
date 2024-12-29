import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contestRoutes from "./routes/contest.js";
import userRoutes from "./routes/userRoutes.js";
import nflRoutes from "./routes/nflRoutes.js";
import forgotPasswordRouter from "./routes/forgetpassword.js";
import businessRoutes from "./routes/businessRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import loggerMiddleware from "./middlewares/loggerMiddleware.js";

dotenv.config();

const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);

  next();
});

app.use("/api/user", userRoutes);
app.use("/api/business", businessRoutes);
app.use("/forgot_password", forgotPasswordRouter);
app.use("/api/contest", contestRoutes);
app.use("/api/nfl", nflRoutes);
app.use("/api/stripe", stripeRoutes);

app.use(loggerMiddleware);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
