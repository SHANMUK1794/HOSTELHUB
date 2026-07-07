import express from "express";
import protect from "../../../utils/authMiddleware.js";
import { adminChef } from "../../../utils/role.js";

import {
  addItem,
  getItems,
  getAllItems,
  updateItem,
  deleteItem,
  deleteInventory,
  exportInventory,
} from "./inventory.controller.js";

const router = express.Router();

router.use(protect);

/* ================= ROUTES ================= */

// ➕ Add usage
router.post("/add", adminChef, addItem);

// 📊 Inventory table
router.get("/get-item", adminChef, getItems);

// 📜 Usage history
router.get("/", adminChef, getAllItems); // or "/history"

// ✏ Update usage
router.put("/update/:id", adminChef, updateItem);

// 🗑 Delete history (soft delete)
router.delete("/delete/:id", adminChef, deleteItem);

// ❌ Delete inventory item (ONLY IF qty = 0)
router.delete("/inventory/:id", deleteInventory);

// 📥 Export Excel
router.get("/export", exportInventory);

export default router;