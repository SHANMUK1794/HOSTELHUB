import express from "express";
import protect from "../../../utils/authMiddleware.js";
import { adminWarden } from "../../../utils/role.js";

// Controllers
import AdvanceController from "./advance.controller.js";
import DueTrackerController from "../dueTracker/dueTracker.controller.js";

const advancerouter = express.Router();

// --- Advance Base Routes ---
advancerouter.post(
  "/add",
  protect,
  adminWarden,
  AdvanceController.createAdvance,
);
advancerouter.put(
  "/advance/:advanceId",
  protect,
  adminWarden,
  AdvanceController.updateAdvance,
);
advancerouter.delete(
  "/advance/:advanceId",
  protect,
  adminWarden,
  AdvanceController.deleteAdvance,
);
advancerouter.get(
  "/get",
  protect,
  adminWarden,
  AdvanceController.getAdvanceDetails,
);
advancerouter.get(
  "/export",
  protect,
  adminWarden,
  AdvanceController.exportAdvanceExcel,
);

// --- Due Tracker Specific Routes ---
advancerouter.post(
  "/due",
  protect,
  adminWarden,
  DueTrackerController.createOrUpdateDue,
);
advancerouter.get(
  "/due/:employee_id",
  protect,
  adminWarden,
  DueTrackerController.getDue,
);
advancerouter.put(
  "/due/:due_tracker_id",
  protect,
  adminWarden,
  DueTrackerController.updateDueTracker,
);
advancerouter.delete(
  "/due/:due_tracker_id",
  protect,
  adminWarden,
  DueTrackerController.deleteDueTracker,
);

export default advancerouter;
