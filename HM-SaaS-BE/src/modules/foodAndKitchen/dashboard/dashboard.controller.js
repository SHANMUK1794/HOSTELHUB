import dashService from "./dashboard.service.js";

class DashController {
  async getTodayKitchenSummary(req, res) {
    try {
      const { date, mealTime, branchName } = req.body;

      if (!date || !mealTime || !branchName) {
        return res.status(400).json({ message: "Date, MealTime, and branchName are required" });
      }

      const result = await dashService.getTodayKitchenSummary(date, mealTime, branchName, req.tenantId);

      // Returns the raw object (day, dish, branches, totals)
      return res.status(200).json(result);
    } catch (error) {
      console.error("Kitchen Dash Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new DashController();