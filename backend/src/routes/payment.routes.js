import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/payment.controllers.js";

const router = express.Router();

// Public route to fetch public key ID
router.get("/razorpay/key", getRazorpayKey);

// Protected routes to initiate and complete payment
router.post("/razorpay/order", authenticateUser, createRazorpayOrder);
router.post("/razorpay/verify", authenticateUser, verifyRazorpayPayment);

export default router;
