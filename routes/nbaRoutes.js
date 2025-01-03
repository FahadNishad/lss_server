import express from "express";
import {
  getNBATeams,
  getNBATeamSchedule,
} from "../controllers/nbaController.js";

const router = express.Router();

router.get("/getNbaTeams", getNBATeams);
router.post("/getNBATeamSchedules", getNBATeamSchedule);

export default router;
