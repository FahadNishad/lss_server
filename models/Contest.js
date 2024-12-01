import mongoose from "mongoose";
// Contest Schema
const ContestSchema = new mongoose.Schema({
  contestName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  topTeamName: {
    type: String,
    required: true,
  },
  leftTeamName: {
    type: String,
    required: true,
  },
  playerPassword: {
    type: String,
    required: true, // This will be hashed
  },
  gridSize: {
    type: Number,
    enum: [25, 50, 100], // Grid size options
    required: true,
  },
  grid: [
    [
      {
        reserved: { type: Boolean, default: false },
        userName: { type: String, default: null }, // User who reserved
      },
    ],
  ],
  randomRowNumbers: [Number], // Random numbers for rows (0-9)
  randomColNumbers: [Number], // Random numbers for columns (0-9)
});

const Contest = mongoose.model("Contest", ContestSchema);
export default Contest;
