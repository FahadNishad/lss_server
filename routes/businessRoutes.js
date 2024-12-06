import express from "express";
import {
  createBusiness,
  deleteAccount,
  loginBusiness,
  signoutBusiness,
  updateBusiness,
  updatePassword,
} from "../controllers/businessController.js";

const router = express.Router();

router.post("/createAccount", createBusiness);
router.post("/login", loginBusiness);
router.post("/logout", signoutBusiness);
router.put("/updateAccount/:businessId", updateBusiness);
router.post("/updatePassword/:businessId", updatePassword);
router.delete("/deleteAccount/:businessId", deleteAccount);

export default router;
