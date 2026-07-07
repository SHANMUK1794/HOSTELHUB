import * as service from "./attendanceCount.service.js";

export const staffCount = async (req, res) => {
  try {
    const result = await service.employeeCount(req.user, req.query, req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in employeeCount:", error);
    return res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error",
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