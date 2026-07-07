import express from "express";
import protect from "../../../utils/authMiddleware.js";
import { adminWarden } from "../../../utils/role.js";
import * as controller from "./residentsAttendance.controller.js";
import * as countController from "../attendanceCount/attendanceCount.controller.js"; // Import from count controller
import kitchenSummary from "../../foodAndKitchen/dashboard/dashboard.controller.js";

const router = express.Router();

router.use(protect);

router.get("/room-data", adminWarden, controller.getAllRoomDataWithUsers);
router.post(
  "/rooms-with-users",
  adminWarden,
  controller.markAttendanceAndGetSummary,
);
router.get("/user", adminWarden, countController.usercount); // Corrected this
router.get("/today", kitchenSummary.getTodayKitchenSummary);

export default router;
