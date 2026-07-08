import * as tenantService from "./tenant.service.js";
import userModel from "../userController/auth.model.js";
import bcrypt from "bcryptjs";

/**
 * Tenant Controller — HTTP handler layer.
 */

/**
 * POST /api/tenant/v1/create
 * Create a new tenant/hostel/PG after signup.
 */
export const createTenant = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const tenant = await tenantService.createTenant(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Organization created successfully.",
      data: tenant,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error.",
    });
  }
};

/**
 * GET /api/tenant/v1/me
 * Get current user's tenant information.
 */
export const getMyTenant = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;

    const tenant = await tenantService.getMyTenant(tenantId);

    return res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error.",
    });
  }
};

/**
 * PUT /api/tenant/v1/update
 * Update tenant details (admin only).
 */
export const updateTenant = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    const userId = req.user?._id;

    if (!tenantId) {
      return res
        .status(400)
        .json({ success: false, message: "No tenant associated." });
    }

    const tenant = await tenantService.updateTenant(tenantId, userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully.",
      data: tenant,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error.",
    });
  }
};

/**
 * POST /api/tenant/v1/setup  (PUBLIC — no JWT required)
 * Onboarding endpoint: accepts email + password + tenant data.
 * Used by the /onboard page to bypass JWT token issues.
 */
export const setupTenant = async (req, res) => {
  try {
    const { email, password, name, branches } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Authenticate user by email + password
    const user = await userModel.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    // Create the tenant
    const tenant = await tenantService.createTenant(user._id, { name, branches });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully.",
      data: tenant,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Server error.",
    });
  }
};
