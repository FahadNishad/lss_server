import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Business from "../models/BusinessModel.js";
const JWT_SECRET = process.env.JWT_SECRET || "fahadnishad124";

const generateUsername = (firstName, lastName) => {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${firstName}${lastName}${randomDigits}`;
};

// Create Business Account
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

// Login Business Account
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

// Signout Business Account
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

export const getBusinessById = async (req, res) => {
  try {
    const businessId = req.params.id;
    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    const { password, ...businessData } = business.toObject();
    res.status(200).json({
      message: "Business data retrieved successfully.",
      business: businessData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Update Business Information
export const updateBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    console.log("this is id", businessId);

    const { firstName, lastName, userName } = req.body;

    const updatedData = { firstName, lastName, userName };
    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedBusiness) {
      return res.status(404).json({ message: "Business not found." });
    }
    const { password: _, ...businessData } = updatedBusiness.toObject(); // Remove password from response

    res.status(200).json({
      message: "Account data updated successfully.",
      user: businessData,
    });
  } catch (error) {
    console.log(error); // Log any errors for debugging

    res.status(500).json({ message: "Server error.", error: error.message }); // Send a 500 error if something fails
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { businessId } = req.params;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long." });
    }
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }
    const isMatch = await bcrypt.compare(currentPassword, business.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    business.password = hashedNewPassword;
    await business.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { businessId } = req.params;
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }
    await Business.findByIdAndDelete(businessId);

    res.status(200).json({ message: "Business account deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
