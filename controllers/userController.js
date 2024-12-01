import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "fahadnishad124";
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, userName, password, authtype } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      userName,
      password: hashedPassword,
      authtype,
    });
    await newUser.save();

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate email
      return res.status(400).json({ message: "Email already registered" });
    }
    console.error("Error during registration:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with that email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const { password: _, ...userData } = user.toObject();
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
