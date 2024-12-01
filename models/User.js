import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true }, // Changed to camelCase for consistency
    lastName: { type: String, required: true }, // Changed to camelCase for consistency
    userName: { type: String, required: true },
    role: { type: String, default: "player" },
    authtype: {
      type: Number,
      required: true,
      enum: [0, 1], // Assuming 0 for manual registration, 1 for social login (modify as per your logic)
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
