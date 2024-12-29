// backend/routes/nflRoutes.js
import express from "express";
import {
  getNFLTeams,
  getNFLTeamSchedule,
} from "../controllers/nflController.js";

const router = express.Router();
router.get("/getNFLTeams", getNFLTeams);
router.post("/getNFLTeamSchedules", getNFLTeamSchedule);
export default router;
