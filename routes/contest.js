import express from "express";
import {
  assignManualNumbers,
  assignRandomNumbers,
  clearNumbers,
  createContest,
  getContest,
  getContestsByUserId,
  reserveSquare,
  updateContest,
  updateContestRules,
} from "../controllers/ContestController.js";

const router = express.Router();

router.post("/create", createContest);
router.get("/getContest/:contestId", getContest);
router.post("/updateContest", updateContest);
router.post("/updateRules", updateContestRules);
router.post("/assignRandomNumbers", assignRandomNumbers);
router.post("/clearNumbers", clearNumbers);
router.post("/assignManualNumbers", assignManualNumbers);
router.post("/reserveSquare", reserveSquare);
router.get("/getContestsByUserId/:userId", getContestsByUserId);

export default router;
