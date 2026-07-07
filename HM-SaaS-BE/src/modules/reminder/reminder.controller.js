import * as reminderService from "./reminder.service.js";

/**
 * GET /getbirthday
 */
export const getBirthDay = async (req, res) => {
  try {
    const userData = req.user || {
      role: "Admin",
      branchName: req.query.branchName || null
    };
    

    const result = await reminderService.getBirthdaysService(userData, req.query.branchName, req.tenantId);
    
    if (!result.success) {
      return res.status(200).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Branch name not specified") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    console.error("Birthday API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * POST /sendmessage
 */
export const sendcustommessage = async (req, res) => {
  try {
    const result = await reminderService.sendCustomMessageService(req.body, req.tenantId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};
