import bcrypt from "bcryptjs";
import Contest from "../models/Contest.js";
import { generateUniqueRandomNumbers } from "../helper/helper.js";
const createContest = async (req, res) => {
  try {
    const {
      contestName,
      topTeamName,
      leftTeamName,
      playerPassword,
      gridSize,
      userId,
      gameDate,
      gameTime,
      gameId,
    } = req.body;

    const gridSaq = parseInt(gridSize);
    let hashedPassword;
    if (![25, 50, 100].includes(gridSaq)) {
      return res.status(400).json({ message: "Invalid grid size" });
    }
    if (playerPassword) {
      hashedPassword = await bcrypt.hash(playerPassword, 10);
    }
    const square = Array.from({ length: Math.sqrt(gridSaq) }, () =>
      Array.from({ length: Math.sqrt(gridSaq) }, () => ({
        reserved: false,
        userName: null,
      }))
    );

    const contest = new Contest({
      contestName,
      topTeamName,
      gameDate,
      gameId,
      gameTime,
      userId,
      leftTeamName,
      playerPassword: hashedPassword || "",
      gridSize: gridSaq,
      square,
      randomRowNumbers: [],
      randomColNumbers: [],
    });

    await contest.save();
    res.status(201).json({
      message: "Contest created successfully!",
      contestId: contest._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create contest" });
  }
};

const getContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    res.status(200).json(contest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contest" });
  }
};

const updateContestRules = async (req, res) => {
  const {
    contestId,
    contestGeneralRules,
    prizesInstructions,
    paymentInstructions,
  } = req.body;

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    if (contestGeneralRules) contest.contestGeneralRules = contestGeneralRules;
    if (prizesInstructions) contest.prizesInstructions = prizesInstructions;
    if (paymentInstructions) contest.paymentInstructions = paymentInstructions;

    await contest.save();

    res.status(200).json({
      message: "Contest rules updated successfully",
      updatedContest: contest,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContestsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const contests = await Contest.find({ userId }).select(
      "contestName topTeamName userId leftTeamName"
    );

    if (!contests || contests.length === 0) {
      return res
        .status(404)
        .json({ message: "No contests found for this user" });
    }

    res.status(200).json(contests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve contests" });
  }
};

const updateContest = async (req, res) => {
  try {
    const { contestId, ...updateFields } = req.body;

    if (!contestId) {
      return res.status(400).json({ message: "Contest ID is required" });
    }

    const updatedContest = await Contest.findByIdAndUpdate(
      contestId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedContest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    res.status(200).json({
      message: "Contest updated successfully",
      updatedContest,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update contest", error: error.message });
  }
};

const assignRandomNumbers = async (req, res) => {
  try {
    const { contestId } = req.body;
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    const gridSaq = contest.gridSize;
    const randomRowNumbers = generateUniqueRandomNumbers(Math.sqrt(gridSaq));
    const randomColNumbers = generateUniqueRandomNumbers(Math.sqrt(gridSaq));

    contest.randomRowNumbers = randomRowNumbers;
    contest.randomColNumbers = randomColNumbers;
    await contest.save();
    res.status(200).json({
      message: "Random numbers assigned successfully",
      contestId: contest._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to assign random numbers" });
  }
};
const assignManualNumbers = async (req, res) => {
  try {
    const { contestId, randomRowNumbers, randomColNumbers } = req.body;

    // Check if the contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Ensure the numbers are valid arrays with correct lengths
    const gridSize = contest.gridSize;
    if (
      !Array.isArray(randomRowNumbers) ||
      !Array.isArray(randomColNumbers) ||
      randomRowNumbers.length !== Math.sqrt(gridSize) ||
      randomColNumbers.length !== Math.sqrt(gridSize)
    ) {
      return res.status(400).json({
        message: `Invalid number arrays. Both row and column numbers should have a length of ${Math.sqrt(
          gridSize
        )}`,
      });
    }
    contest.randomRowNumbers = randomRowNumbers;
    contest.randomColNumbers = randomColNumbers;
    await contest.save();

    res.status(200).json({
      message: "Manual numbers assigned successfully",
      contestId: contest._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to assign numbers" });
  }
};

const clearNumbers = async (req, res) => {
  try {
    const { contestId } = req.body;
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    contest.randomRowNumbers = [];
    contest.randomColNumbers = [];
    await contest.save();

    res.status(200).json({
      message: "Random numbers cleared successfully",
      contestId: contest._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to clear random numbers" });
  }
};

const reserveSquare = async (req, res) => {
  try {
    const { contestId, squareId, userId, userName } = req.body;

    if (!contestId || !squareId || !userId || !userName) {
      return res.status(400).json({
        error: "contestId, squareId, userId, and userName are required",
      });
    }

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    const userReserveCount = contest.square
      .flat()
      .filter((sq) => sq.userId?.toString() === userId && sq.reserved).length;

    if (userReserveCount >= 4) {
      return res
        .status(400)
        .json({ message: "You can only reserve up to 4 squares" });
    }

    let targetSquare = null;
    for (let row of contest.square) {
      targetSquare = row.find((sq) => sq._id.toString() === squareId);
      if (targetSquare) break;
    }

    if (!targetSquare) {
      return res.status(404).json({ error: "Square not found" });
    }

    if (targetSquare.reserved) {
      return res.status(400).json({ error: "Square is already reserved" });
    }

    targetSquare.reserved = true;
    targetSquare.userId = userId;
    targetSquare.userName = userName;
    targetSquare.paymentStatus = "pending";

    await contest.save();

    res.status(200).json({
      message: "Square reserved successfully",
      updatedSquare: targetSquare,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while reserving the square" });
  }
};
const squarePaymentSuccess = async (req, res) => {
  try {
    const { contestId, squareId, userId } = req.body;

    if (!contestId || !squareId) {
      return res.status(400).json({
        error: "contestId, squareId, userId, and userName are required",
      });
    }

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }
    let targetSquare = null;
    for (let row of contest.square) {
      targetSquare = row.find((sq) => sq._id.toString() === squareId);
      if (targetSquare) break;
    }

    if (!targetSquare) {
      return res.status(404).json({ error: "Square not found" });
    }

    targetSquare.paymentStatus = "completed";
    await contest.save();

    res.status(200).json({
      message: "Square payment success",
      updatedSquare: targetSquare,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment" });
  }
};

export {
  createContest,
  getContest,
  getContestsByUserId,
  updateContestRules,
  updateContest,
  assignRandomNumbers,
  assignManualNumbers,
  clearNumbers,
  reserveSquare,
  squarePaymentSuccess,
};
