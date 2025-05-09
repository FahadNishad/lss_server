import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema(
  {
    contestName: {
      type: String,
      required: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    gameId: {
      type: String,
    },
    gameTime: {
      type: String,
    },
    gameDate: {
      type: String,
    },
    contestType: {
      type: String,
      default: "local",
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
      // required: false,
    },
    gridSize: {
      type: Number,
      enum: [25, 50, 100],
      required: true,
    },
    contestStatus: {
      type: String,
      default: "open",
    },
    entryCost: {
      type: Number,
    },
    canPlayersEdit: {
      type: Boolean,
      default: true,
    },
    square: [
      [
        {
          reserved: { type: Boolean, default: false },
          userName: { type: String, default: null },
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
          },
          paymentStatus: {
            type: String,
            default: "pending",
          },
        },
      ],
    ],
    randomRowNumbers: [Number],
    randomColNumbers: [Number],
    contestGeneralRules: {
      type: String,
      default:
        "The commissioner has not defined general rules for this contest. Please email them directly with any questions you may have.",
    },
    prizesInstructions: {
      type: String,
      default:
        "The commissioner has not defined guidelines for how prizes are defined or awarded. Please email them directly with any questions you may have.",
    },
    paymentInstructions: {
      type: String,
      default:
        "The commissioner has not defined guidelines for how to pay for your entry. Please email them directly with any questions you may have.",
    },
    paymentOption: {
      type: String,
      enum: ["Stripe"],
      default: "Stripe",
    },
    boxSold: {
      type: Number,
      default: 0,
    },
    boxSoldLength: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Refunded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Contest = mongoose.model("Contest", ContestSchema);
export default Contest;
