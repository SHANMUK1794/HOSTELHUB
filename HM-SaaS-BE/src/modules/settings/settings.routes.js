import express from "express";
import { getSettings, updateSettings } from "./settings.controller.js";
import protect from "../../utils/authMiddleware.js";
import { adminOnly } from "../../utils/role.js";

const router = express.Router();
router.use(protect);

router.get("/", adminOnly, getSettings);
router.put("/", adminOnly, updateSettings);

// 👉 FIXED: We changed 'updateConfig' to 'updateSettings' so it matches your controller!
router.put("/update", adminOnly, updateSettings); 

export default router;