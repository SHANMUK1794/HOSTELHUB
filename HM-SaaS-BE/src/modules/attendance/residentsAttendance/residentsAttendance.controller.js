// import { markAttendance } from "./residentsAttendance.service.js";

// export const markAttendanceController = async (req, res) => {
//   try {
//     const result = await markAttendance(req);
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import * as service from "./residentsAttendance.service.js";

export const getAllRoomDataWithUsers = async (req, res) => {
  try {
    const result = await service.getAllRoomDataWithUsers(req.user, req.body, req.query, req.tenantId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getAllRoomDataWithUsers:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
      error: error.message,
    });
  }
};

export const markAttendanceAndGetSummary = async (req, res) => {
  try {
    const result = await service.markAttendanceAndGetSummary(req.user, req.body, req.tenantId);
    return res.status(200).json({
      message: "Attendance marked successfully",
      attendanceId: result.attendanceId,
      data: result.data,
    });
  } catch (error) {
    console.error("Error in markAttendanceAndGetSummary:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
      data: error.message,
    });
  }
};

export const usercount = async (req, res) => {
  try {
    const result = await service.usercount(req.user, req.query, req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in usercount:", error);
    return res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error",
    });
  }
};