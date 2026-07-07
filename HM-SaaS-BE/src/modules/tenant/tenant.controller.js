import * as tenantService from "./tenant.service.js";

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
