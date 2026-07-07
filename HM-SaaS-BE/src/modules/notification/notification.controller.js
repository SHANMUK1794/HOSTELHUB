import notifyService from "./notification.service.js";

export const triggerNotificationCreation = async (req, res) => {
  try {
    await notifyService.generateDailyNotifications(req.tenantId);
    res
      .status(200)
      .json({ success: true, message: "Notifications created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const runDailyNotificationsOnce = async (tenantId) => {
  try {
    console.log("Running notifications for tenant:", tenantId);

    await notifyService.generateDailyNotifications(tenantId);

    console.log("Daily notifications generated successfully.");
  } catch (error) {
    console.error("Error generating daily notifications:", error);
  }
};

export const getNotifications = async (req, res) => {
  try {
    // Generate today's notifications before fetching
    await notifyService.generateDailyNotifications(req.tenantId);

    const data = await notifyService.getNotificationsForUser(
      req.user,
      req.query.branchName,
      req.tenantId
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const markSeen = async (req, res) => {
  try {
    const result = await notifyService.markAsSeen(req.params.id, req.user.role, req.tenantId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markAllSeen = async (req, res) => {
  try {
    const count = await notifyService.markAllSeen(
      req.user,
      req.query.branchName,
      req.tenantId
    );
    res
      .status(200)
      .json({ success: true, message: `${count} notifications updated` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
