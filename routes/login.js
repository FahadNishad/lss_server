const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Adjust the path to your User model as necessary

const router = express.Router();

// Login Route
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }

    // Compare the password with the hashed password
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Successful login, you can create a session or return a token here
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
