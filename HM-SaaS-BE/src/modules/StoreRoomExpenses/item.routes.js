import express from "express";
import protect from "../../utils/authMiddleware.js";
import { adminStoreman } from "../../utils/role.js";
import {
  addItem,
  getAllItems,
  updateItem,
  deleteItem,
  exportExcel,
} from "./item.controller.js";

const router = express.Router();

router.use(protect);

router.post("/add", adminStoreman, addItem);
router.get("/", adminStoreman, getAllItems);
router.put("/update/:id", adminStoreman, updateItem);

// Matched perfectly to frontend call: DELETE /api/v1/store_room_expense/:id
router.delete("/:id", adminStoreman, deleteItem);

router.get("/export", adminStoreman, exportExcel);

export default router;
