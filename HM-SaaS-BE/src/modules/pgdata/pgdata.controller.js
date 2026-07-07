import pgService from "./pgdata.service.js";
import { handleError } from "../../utils/errorHandler.js";

/* ---------------- REGISTER ---------------- */
export const register = async (req, res) => {
  try {
    const result = await pgService.registerUser(
      req.body,
      req.user,
      req.tenantId
    );

    return res.status(201).json({
      success: true,
      message: "PG user registered successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/* ---------------- GET ALL USERS ---------------- */
export const getAllUsers = async (req, res) => {
  try {
    const { users, totalCount } = await pgService.getAllUsers(
      req.user,
      req.query,
      req.tenantId
    );

    return res.status(200).json({
      success: true,
      length: totalCount,
      data: users,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/* ---------------- UPDATE ---------------- */
export const update = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "Admin" && role !== "Warden") {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    const result = await pgService.updateUser(
      req.params.id,
      req.body,
      role,
      req.tenantId
    );

    return res.status(200).json({
      success: true,
      message: "PG user updated successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/* ---------------- DELETE ---------------- */
export const deleteUser = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "Admin" && role !== "Warden") {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    await pgService.deleteUser(
      req.params.id,
      req.tenantId
    );

    return res.status(200).json({
      success: true,
      message: "PG user deleted successfully",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/* ---------------- GET USER BY MOBILE ---------------- */
export const getUserByMobile = async (req, res) => {
  try {
    const { MobileNo } = req.query;

    if (!MobileNo) {
      return res.status(400).json({
        success: false,
        message: "MobileNo is required",
      });
    }

    const result = await pgService.searchByMobile(
      MobileNo,
      req.tenantId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/* ---------------- EXPORT EXCEL ---------------- */
export const exportExcel = async (req, res) => {
  try {
    const buffer = await pgService.generateExcel(
      req.user,
      req.query,
      req.tenantId
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="PG_Export.xlsx"'
    );

    return res.end(buffer);
  } catch (error) {
    return handleError(res, error);
  }
};

/* ---------------- DEACTIVATE USER ---------------- */
export const deactivateUser = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "Admin" && role !== "Warden") {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    const result = await pgService.deactivateUser(
      req.params.id,
      req.body,
      req.tenantId
    );

    return res.status(200).json({
      success: true,
      message: "PG user status updated successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};