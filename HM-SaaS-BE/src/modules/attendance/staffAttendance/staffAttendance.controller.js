import * as service from "./staffAttendance.service.js";

export const getAllStaffAttendance = async (req, res) => {
  try {
    const result = await service.getAllStaffDataForAttendance(req.user, req.query, req.tenantId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const getStaffStats = async (req, res) => {
  try {
    const admin_id = req.user?._id;
    if (!admin_id) return res.status(401).json({ message: "Unauthorized Admin" });

    const empId = req.params.empId;
    
    // Ensure Admin can check any branch passed in query, Wardens use their assigned branch
    const branchName = req.user.role === "Admin" ? req.query.branchName : req.user.branchName;

    const stats = await service.getSingleStaffStats(admin_id, branchName, empId);
    
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching individual staff stats:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const updateStaffAttendance = async (req, res) => {
  try {
    const result = await service.updateStaffAttendance(req.user, req.body, req.tenantId);
    return res.status(200).json({
      success: true,
      message: "Employee attendance updated successfully",
      updatedEntries: result.updatedEntries,
      skipped: result.skipped,
    });
  } catch (error) {
    console.error("Error updating employee attendance:", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
      error: error.message,
    });
  }
};
