import express from "express";
import protect from "../../utils/authMiddleware.js";
import {
  getMySubscription,
  activateSubscription,
  createRazorpayOrder,
  verifyRazorpayPayment,
  cancelSubscription,
} from "./subscription.controller.js";

const router = express.Router();

router.use(protect);

router.get("/me", getMySubscription);
router.post("/activate", activateSubscription);
router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyRazorpayPayment);
router.post("/cancel", cancelSubscription);

export default router;
