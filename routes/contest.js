import express from "express";
import {
  assignManualNumbers,
  assignRandomNumbers,
  clearNumbers,
  createContest,
  getContest,
  getContestsByUserId,
  getReservedSquare,
  reserveSquare,
  squarePaymentSuccess,
  updateContest,
  updateContestRules,
} from "../controllers/ContestController.js";

const router = express.Router();

router.post("/create", createContest);
router.get("/getContest/:contestId", getContest);
router.put("/updateContest", updateContest);
router.post("/updateRules", updateContestRules);
router.post("/assignRandomNumbers", assignRandomNumbers);
router.post("/clearNumbers", clearNumbers);
router.post("/assignManualNumbers", assignManualNumbers);
router.post("/reserveSquare", reserveSquare);
router.post("/square-payment-success", squarePaymentSuccess);
router.get("/getContestsByUserId/:userId", getContestsByUserId);
router.post("/getReservedSquare", getReservedSquare);

export default router;
