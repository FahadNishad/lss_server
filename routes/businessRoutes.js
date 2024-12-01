import express from "express";
import {
  createBusiness,
  loginBusiness,
  signoutBusiness,
} from "../controllers/businessController.js";

const router = express.Router();

router.post("/createAccount", createBusiness);
router.post("/login", loginBusiness);
router.post("/logout", signoutBusiness);

export default router;
