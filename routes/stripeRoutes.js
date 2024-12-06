import express from "express";
import {
  createPaymentIntent,
  handlePaymentSuccess,
} from "../controllers/stripeController.js";

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/payment-success", handlePaymentSuccess);

export default router;
