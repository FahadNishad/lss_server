import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import User from "../models/User.js"; // Ensure the path includes .js extension

const router = express.Router();

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to generate a random OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Store OTPs temporarily (in a real app, you should use a secure database or cache like Redis)
const otpStore = {};

// Route to send OTP to user's email
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP and send email
    const otp = generateOtp();
    otpStore[email] = otp; // Store OTP temporarily

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "OTP sent to email" });
    });
  } catch (error) {
    console.error("Error in /send-otp:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  // Check if the OTP matches
  if (otpStore[email] === otp) {
    delete otpStore[email]; // Remove OTP after verification
    res.status(200).json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

// Route to change the password
router.post("/change-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in /change-password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
