import express from "express";
import protect from "../../../utils/authMiddleware.js";
import { adminChef } from "../../../utils/role.js";
import menuController from "./menu.controller.js";
import dashController from "../dashboard/dashboard.controller.js";

// 🚨 IMPORT YOUR NEW LOCAL UPLOAD MIDDLEWARE
import uploadLocal from "../../../utils/uploadLocal.js"; 

const foodMenuRouter = express.Router();

// ==========================================
// 📂 LOCAL DISK UPLOAD ROUTE
// ==========================================
foodMenuRouter.post(
  "/uploadImage",
  protect,
  adminChef,
  uploadLocal.single("image"),      // 1. Saves the file locally using diskStorage
  menuController.uploadKitchenImage // 2. Returns the /uploads/... path to frontend
);
// ==========================================

foodMenuRouter.get("/getMenu", protect, adminChef, menuController.getMenu);
foodMenuRouter.get("/today", protect, menuController.getTodayMenu);
foodMenuRouter.post("/createMenu", protect, adminChef, menuController.createMenu);
foodMenuRouter.put("/updateMenu", protect, adminChef, menuController.updateMenu);
foodMenuRouter.delete("/deletemenu/:id", protect, adminChef, menuController.deleteMenu);
foodMenuRouter.post("/dashMenu", protect, adminChef, dashController.getTodayKitchenSummary);

export default foodMenuRouter;