import express from "express";
import protect from "../../utils/authMiddleware.js";
import { createTenant, getMyTenant, updateTenant } from "./tenant.controller.js";

const router = express.Router();

// All tenant routes require authentication
router.use(protect);

// Create a new tenant (post-signup, when user has no tenantId)
router.post("/create", createTenant);

// Get current user's tenant
router.get("/me", getMyTenant);

// Update tenant details (admin only)
router.put("/update", updateTenant);

export default router;
