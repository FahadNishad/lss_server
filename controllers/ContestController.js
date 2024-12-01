import bcrypt from "bcryptjs";
import Contest from "../models/Contest.js";
const createContest = async (req, res) => {
  try {
    const {
      contestName,
      topTeamName,
      leftTeamName,
      playerPassword,
      gridSize,
      userId,
    } = req.body;

    const gridSaq = parseInt(gridSize);
    if (![25, 50, 100].includes(gridSaq)) {
      return res.status(400).json({ message: "Invalid grid size" });
    }

    const hashedPassword = await bcrypt.hash(playerPassword, 10);
    const grid = Array.from({ length: Math.sqrt(gridSaq) }, () =>
      Array.from({ length: Math.sqrt(gridSaq) }, () => ({
        reserved: false,
        userName: null,
      }))
    );
    const randomRowNumbers = generateUniqueRandomNumbers(Math.sqrt(gridSaq));
    const randomColNumbers = generateUniqueRandomNumbers(Math.sqrt(gridSaq));
    const contest = new Contest({
      contestName,
      topTeamName,
      userId,
      leftTeamName,
      playerPassword: hashedPassword,
      gridSize: gridSaq,
      grid,
      randomRowNumbers,
      randomColNumbers,
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
export { createContest, getContest };

const generateUniqueRandomNumbers = (size) => {
  const numbers = new Set();
  while (numbers.size < size) {
    const num = Math.floor(Math.random() * 10);
    numbers.add(num);
  }
  return Array.from(numbers);
};
