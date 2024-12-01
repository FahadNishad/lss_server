import express from "express";
import { createContest, getContest } from "../controllers/ContestController.js";

const router = express.Router();

router.post("/create", createContest);
router.get("/getContest/:contestId", getContest);

export default router;
