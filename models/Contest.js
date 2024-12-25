import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema({
  contestName: {
    type: String,
    required: false,
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
    required: false,
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
});

const Contest = mongoose.model("Contest", ContestSchema);
export default Contest;

// // New fields for live game and score integration
// gameDetails: {
//   gameId: { type: String }, // ID from the sports API for the game
//   gameDate: { type: Date }, // The game date and time
//   gameType: { type: String, enum: ["NFL", "NBA", "MLB"] }, // Game type (NFL, NBA, etc.)
//   gameUrl: { type: String, default: "" }, // Link to external page or API for more game details
//   liveScore: {
//     homeScore: { type: Number, default: 0 }, // Home team score
//     awayScore: { type: Number, default: 0 }, // Away team score
//     quarter: { type: Number, default: 1 }, // Current quarter/period
//   },
//   topTeamLogo: { type: String, default: "" }, // URL for the home team logo
//   leftTeamLogo: { type: String, default: "" }, // URL for the away team logo
// },

// // New fields for prize and media
// prizeDetails: {
//   prizeAmount: { type: Number, required: true }, // Dollar amount for the prize
//   prizeDescription: { type: String, default: "No description available" }, // A text description of the prize
//   prizeMedia: [{ type: String }], // Array of URLs for images or videos related to the prize
//   prizeLinks: [{ type: String }], // Array of external links to prize-related content (images/videos)
// },

// Payment status
