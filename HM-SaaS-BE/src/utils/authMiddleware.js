import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const protect = async (req, res, next) => {
  try {
    // Accept token from Authorization header (Bearer) OR any cookie name
    let token =
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null) ||
      req.cookies.auth_token ||
      req.cookies.refreshToken;

    if (!token) {
      res.status(401).json({ error: "Not Authorized, No Token" });
      return;
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded.uuid) {
      res.status(401).json({ error: "Not Authorized, Invalid Token" });
      return;
    }

    const foundUser = await prisma.user.findUnique({
      where: { id: decoded.uuid.toString() },
      select: {
        id: true,
        staffName: true,
        role: true,
        shift: true,
        username: true,
        phoneNo: true,
        email: true,
        tenantId: true,
        admin_id: true,
        branchName: true,
        staying: true,
        vacatedate: true,
        isdeleted: true,
        deleteddate: true,
        deleteby: true,
        module: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    req.user = foundUser ? { ...foundUser, _id: foundUser.id } : null;
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
      const subscription = await prisma.subscription.findUnique({
        where: { organizationId: req.tenantId },
      });

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
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { subscriptionStatus: "inactive" },
        });
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

