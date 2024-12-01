import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String },
    profileInReview: { type: Boolean, default: true },
    role: { type: String, default: "business" },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
  },
  { timestamps: true }
);

const Business = mongoose.model("Business", businessSchema);

export default Business;
