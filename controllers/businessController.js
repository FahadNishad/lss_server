import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Import JWT
import Business from "../models/BusinessModel.js";
const JWT_SECRET = process.env.JWT_SECRET || "fahadnishad124";

const generateUsername = (firstName, lastName) => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${firstName}${lastName}${randomDigits}`;
};

export const createBusiness = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await Business.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists. Please sign in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userName = generateUsername(firstName, lastName);
    const newBusiness = new Business({
      firstName,
      lastName,
      userName,
      email,
      phone,
      password: hashedPassword,
    });

    const user = await newBusiness.save();
    const { password: _, ...userData } = user.toObject();

    res.status(201).json({
      message: "Business account created successfully.",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const loginBusiness = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    const user = await Business.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userData } = user.toObject();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful.",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const signoutBusiness = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Signout successful." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
