import * as registerService from "./register.service.js";
import { handleError } from "../../utils/errorHandler.js";

/* ---------------- REGISTER ---------------- */
export const register = async (req, res) => {
  try {
    const newUser = await registerService.registerUser(req.body, req.user, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    if (error.message.includes("already registered")) {
      return res.status(400).json({ success: false, message: error.message });
    }

    if (error.message === "Room not found.") {
      return res.status(404).json({ success: false, message: error.message });
    }

    if (
      error.message.includes("fully occupied") ||
      error.message === "Future dates are not allowed"
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error("Register error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* ---------------- GET ALL USERS ---------------- */
export const getUserByMobile = async (req, res) => {
  try {
    const { MobileNo } = req.query;
    if (!MobileNo) {
      return res.status(400).json({ success: false, message: "MobileNo is required" });
    }
    const user = await registerService.getUserByMobile(MobileNo, req.tenantId);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
  return handleError(res, error);
}
};

export const getAllUsers = async (req, res) => {
  try {
    const query = {
      ...req.query,
      month: req.query.month?.toLowerCase(), // normalize
    };

    const users = await registerService.findAllUsers(req.user, query, req.tenantId);

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
  return handleError(res, error);
}
};

/* ---------------- UPDATE USER ---------------- */
export const updateUser = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "Admin" && role !== "Warden") {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    const updatedUser = await registerService.updateUser(
      req.params.id,
      req.body,
      req.user,
      req.tenantId
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
  return handleError(res, error);
}
};

/* ---------------- SOFT DELETE ---------------- */
export const deleteUser = async (req, res) => {
  try {
    const result = await registerService.softDeleteUser(
      req.params.id,
      req.user._id,
      req.tenantId
    );

    return res.status(200).json({
      success: true,
      message: "User moved to Trash successfully",
      data: result,
    });
  } catch (error) {
  return handleError(res, error);
}
};

/* ---------------- DEACTIVATE ---------------- */
export const deactive = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "Admin" && role !== "Warden") {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    const { id, vacatedate } = req.body;

    const result = await registerService.deactivateUser(
      id,
      vacatedate,
      req.user,
      req.tenantId
    );

    return res.status(200).json({
      success: true,
      message: result.vacated
        ? "User vacated immediately."
        : "Vacation form created. User will be auto-vacated later.",
      data: result.user,
    });
  } catch (error) {
  return handleError(res, error);
}
};

/* ---------------- BULK IMPORT ---------------- */
export const bulkImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await registerService.bulkImport(req.file.path, req.user, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Bulk import completed",
      data: result,
    });
  } catch (error) {
  return handleError(res, error);
}
};

/* ---------------- PERMANENT DELETE ONE ---------------- */
export const permanentDeleteUser = async (req, res) => {
  try {
    await registerService.permanentDeleteUser(req.params.id, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "User permanently deleted successfully",
    });
  v} catch (error) {
  return handleError(res, error);
}
};

/* ---------------- PERMANENT DELETE ALL ---------------- */
export const permanentDeleteAllUsers = async (req, res) => {
  try {
    const result = await registerService.permanentDeleteAllUsers(req.tenantId);

    return res.status(200).json({
      success: true,
      message: `Recycle bin cleared — ${result.deletedCount} users deleted.`,
    });
  } catch (error) {
  return handleError(res, error);
}
};

/* ---------------- RECOVER USER ---------------- */
export const recoverUser = async (req, res) => {
  try {
    const user = await registerService.recoverUser(req.params.id, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "User recovered successfully",
      data: user,
    });
  } catch (error) {
  return handleError(res, error);
}
};

/* ---------------- GET DELETED USERS ---------------- */
export const getDeletedUsers = async (req, res) => {
  try {
    const users = await registerService.getDeletedUsers(
      req.user,
      req.body,
      req.query,
      req.tenantId
    );

    return res.status(200).json({
      success: true,
      message:
        users.length === 0
          ? "No Deleted Users Found"
          : "Deleted Users Retrieved Successfully",
      data: users,
    });
  } catch (error) {
  return handleError(res, error);
}
};