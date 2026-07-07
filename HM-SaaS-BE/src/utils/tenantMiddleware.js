/**
 * Tenant Guard Middleware
 * 
 * Runs AFTER the `protect` auth middleware.
 * Ensures the authenticated user has a valid tenantId.
 * Sets `req.tenantId` for all downstream handlers.
 * 
 * Usage: router.use(protect, tenantGuard);
 */
const tenantGuard = (req, res, next) => {
  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(403).json({
        success: false,
        message: "No organization associated with your account. Please create one first.",
      });
    }

    // Set tenantId on request for easy access in controllers/services
    req.tenantId = tenantId;
    next();
  } catch (error) {
    console.error("Tenant guard error:", error);
    return res.status(500).json({
      success: false,
      message: "Tenant validation failed.",
    });
  }
};

export default tenantGuard;
