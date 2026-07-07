import express from "express";
import * as fundController from "./fund.controller.js";
import protect from "../../../utils/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, fundController.createIncomingFund);
router.get("/get", protect, fundController.getIncomingFundWithTotal);
router.put("/update/:id", protect, fundController.updateIncomingFund);
router.delete("/delete/:id", protect, fundController.deleteIncomingFund);

export default router;
