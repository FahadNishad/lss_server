import express from "express";
import {
  createContest,
  getContest,
  getContestsByUserId,
} from "../controllers/ContestController.js";

const router = express.Router();

router.post("/create", createContest);
router.get("/getContest/:contestId", getContest);
router.get("/getContestsByUserId/:userId", getContestsByUserId);

export default router;
