import menuService from "./menu.service.js";
import mongoose from "../../../config/mongoose-compat.js";

class MenuController {
  async createMenu(req, res) {
    try {
      const { MealTime, Menu: menuData, branchName } = req.body;
      const data = await menuService.createMenu(MealTime, branchName, menuData, req.tenantId);
      res.status(200).json({ success: true, message: "successfully created the dishes", data });
    } catch (error) {
      if (error.message === "ALREADY_EXISTS") {
        return res.status(400).json({ success: false, message: `${req.body.MealTime} menu already exists.` });
      }
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  }

  async getMenu(req, res) {
    try {
      const branchName = req.query.branchName;
      const data = await menuService.getAllMenus(branchName, req.tenantId);
      if (data.length === 0) return res.status(200).json({ success: false, message: "No Records Found" });
      res.status(200).json({ success: true, message: "successfully Fetched the data", data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  }

  async updateMenu(req, res) {
    try {
      const { MealTime, Menu: menuData, branchName } = req.body;
      const data = await menuService.updateMenu(MealTime, branchName, menuData, req.tenantId);
      res.status(200).json({ success: true, message: "Successfully updated the menu", data });
    } catch (error) {
      console.error("UPDATE CRASH LOG:", error);
      if (error.message === "NOT_FOUND") return res.status(404).json({ success: false, message: "Menu Not Found" });
      if (error.message === "NO_CHANGES") return res.status(409).json({ success: false, message: "Menu has no changes." });
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  }

  async deleteMenu(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid ID format" });
      const deleted = await menuService.deleteMenu(id, req.tenantId);
      if (!deleted) return res.status(404).json({ success: false, message: "Menu Not Found" });
      res.status(200).json({ success: true, message: "Menu Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  async getTodayMenu(req, res) {
    try {
      // Safely extract and force string conversion to prevent array parsing crashes
      const incomingDate = String(req.query.date || req.query.Date || "");
      const incomingMealTime = String(req.query.mealTime || req.query.MealTime || req.query.mealtime || "");
      const branchName = req.query.branchName;

      if (!incomingDate || !incomingMealTime || incomingDate === "undefined") {
        return res.status(400).json({ success: false, message: "Missing required Date or MealTime" });
      }

      const dateObj = new Date(incomingDate);
      if (isNaN(dateObj)) {
        return res.status(400).json({ success: false, message: "Invalid date format received" });
      }
      
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const targetDayName = daysOfWeek[dateObj.getDay()];

      const serviceResponse = await menuService.getTodayMenu(incomingMealTime, targetDayName, branchName, req.tenantId); 
      
      const vegItems = serviceResponse?.data?.Veg || [];
      const nonVegItems = serviceResponse?.data?.NonVeg || [];
      const combinedDishes = [...vegItems, ...nonVegItems];

      // ALWAYS return success: true to prevent frontend Axios interceptors from throwing error toasts
      return res.status(200).json({
        success: true,
        day: targetDayName,
        mealTime: incomingMealTime,
        dishes: combinedDishes.length > 0 ? combinedDishes.map(d => d?.name || "Unnamed") : [], 
        image: combinedDishes[0]?.image || null,
        meals: combinedDishes.length > 0 ? combinedDishes.map(d => d?.name || "Unnamed") : [],
        data: serviceResponse?.data || { Veg: [], NonVeg: [] }
      });

    } catch (error) {
      console.error("Fetch Today Menu Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
  }

  // 🚨 ADDED: New Local Image Upload Controller inside the class
  uploadKitchenImage(req, res) {
    try {
      // Multer automatically puts the saved file info inside req.file
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No image provided" });
      }

      // Create the public URL path
      const imageUrl = `/uploads/${req.file.filename}`;

      // Send the path back to the frontend
      res.status(200).json({ 
        success: true, 
        imageUrl: imageUrl 
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ success: false, message: "Failed to upload image" });
    }
  }
}

export default new MenuController();