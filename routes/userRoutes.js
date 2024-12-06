import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  updatePassword,
  deleteAccount,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/updateAccount/:userId", updateUser);
router.post("/updatePassword/:userId", updatePassword);
router.delete("/deleteAccount/:userId", deleteAccount);

export default router;
