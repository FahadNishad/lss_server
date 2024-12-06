import stripe from "../utils/stripe.js";
import User from "../models/User.js";

export const createPaymentIntent = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 999,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

export const handlePaymentSuccess = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isActive = true;
    user.subscriptionExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

    const updatedUser = await user.save();
    const { password, ...userData } = updatedUser.toObject();
    res
      .status(200)
      .json({ message: "Account activated successfully", user: userData });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to activate account" });
  }
};
