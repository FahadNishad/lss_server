import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true },
    role: { type: String, default: "player" },
    authtype: {
      type: Number,
      required: true,
      enum: [0, 1],
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false }, // Indicates if the account is active
    subscriptionExpiry: { type: Date }, // Tracks when the subscription expires
    accessBlocked: { type: Boolean, default: false }, // Block access if account is inactive or other conditions
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
