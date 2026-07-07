import dashboardService from "./dashboard.service.js";

class DashboardController {
  async getDashboard(req, res) {
    try {
      const { role } = req.user;
      let branchName;

      if (role === "Admin" || role === "Staff") {
        branchName = req.query.branchName?.trim();
      } else if (role === "Chef" || role === "Kitchen branch") {
        branchName = req.user.branchName;
      } else if (role === "Warden") {
        branchName = req.user.branchName;
      } else {
        branchName = req.user.branchName;
      }

      if (!branchName) {
        return res
          .status(400)
          .json({ success: false, message: "branchName is required" });
      }

      const data = await dashboardService.getDashboardData(
        branchName,
        new Date(),
        req.tenantId
      );

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
}

export default new DashboardController();
