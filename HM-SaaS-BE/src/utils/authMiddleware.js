import jwt from "jsonwebtoken";
import user from "../modules/User&Roles/userRoles.model.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      res.status(401).json({ error: "Not Authorized, No Token" });
      return;
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = await user
      .findById(decoded.uuid)
      .select("-password -refreshToken");
    if (!req.user) {
      res.status(401).json({ error: "Not Authorized, User Not Found" });
      return;
    }

    // Multi-tenant: set tenantId on request for downstream handlers
    req.tenantId = req.user.tenantId || null;

    const reqPath = req.originalUrl.split('?')[0];
    if (!req.tenantId && !reqPath.startsWith("/api/tenant/v1")) {
      return res.status(403).json({
        success: false,
        message: "No organization associated with your account. Please create one first.",
      });
    }

    // Allow certain routes to bypass subscription checks
    const isExempt = reqPath.startsWith("/api/users/v1") || 
                     reqPath.startsWith("/api/tenant/v1") || 
                     reqPath.startsWith("/api/subscription/v1");

    if (!isExempt) {
      // Dynamic import to avoid circular dependencies if any, though regular import is fine too.
      const Subscription = (await import("../modules/subscription/subscription.model.js")).default;
      const subscription = await Subscription.findOne({ organizationId: req.tenantId });

      if (!subscription) {
        return res.status(403).json({ 
          success: false, 
          message: "Subscription Required: No active subscription found.", 
          requireSubscription: true 
        });
      }

      const now = new Date();
      let isExpired = false;
      let expireMsg = "";

      if (subscription.planName === "Shepherd") {
        if (now > subscription.trialEndDate) {
          isExpired = true;
          expireMsg = "Subscription Expired: Your free trial has ended.";
        }
      } else {
        if (now > subscription.subscriptionEndDate) {
          isExpired = true;
          expireMsg = "Subscription Expired: Your plan has expired.";
        }
      }

      if (isExpired && subscription.subscriptionStatus !== "inactive") {
        subscription.subscriptionStatus = "inactive";
        await subscription.save();
      }

      if (subscription.subscriptionStatus !== "active") {
        return res.status(403).json({ 
          success: false, 
          message: expireMsg || "Subscription Inactive: Your subscription is not active.", 
          requireSubscription: true 
        });
      }
    }

    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    res.status(401).json({ error: "Not Authorized, Invalid Token" });
  }
};

export default protect;

