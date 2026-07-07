// import express from "express";
// import { updateStaffController } from "./staffAttendance.controller.js";
// import protect from "../../../utils/authMiddleware.js";

// const router = express.Router();

// router.post("/", protect, updateStaffController);

// export default router;

import express from "express";
import protect from "../../../utils/authMiddleware.js";
import { allaccess } from "../../../utils/role.js";
import { staffCount } from "../attendanceCount/attendanceCount.controller.js";


import {
  getAllStaffAttendance,
  updateStaffAttendance,
  getStaffStats,

} from "./staffAttendance.controller.js";

const router = express.Router();

router.get("/staff-attendance", protect, allaccess, getAllStaffAttendance);
router.post("/update-staff-attendance", protect, allaccess, updateStaffAttendance);
router.get("/staff", protect, allaccess, staffCount);
router.get("/staff-attendance/stats/:empId", protect, allaccess, getStaffStats);

export default router;

// import express from "express";
// import { adminWarden } from "../../../utils/role.js";
// import {
//   getAllStaffDataForAttendance,
//   updateStaffAttendance,
// } from "./staffAttendance.controller.js";

// const router = express.Router();

// router.get("/staff-data", adminWarden, getAllStaffDataForAttendance);
// router.put("/staff-attendance", adminWarden, updateStaffAttendance);

// export default router;