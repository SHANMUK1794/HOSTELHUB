import express from "express";
import * as controller from "./notification.controller.js";
import protect from "../../utils/authMiddleware.js";

const router = express.Router();

router.get("/get", protect, controller.getNotifications);
router.get("/create", protect, controller.triggerNotificationCreation);
router.put("/seen/:id", protect, controller.markSeen);
router.put("/seen-all", protect, controller.markAllSeen);

export default router;
