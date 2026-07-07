import express from "express";
import protect from "../../../utils/authMiddleware.js";
import { adminChef } from "../../../utils/role.js";

import {
  createCylinder,
  getAllCylinders,
  updateCylinder,
  exportCylinders, // 👈 IMPORT THIS
  deleteCylinder,
} from "./cylinder.controller.js";

const router = express.Router();

router.use(protect);

router.post("/add", adminChef, createCylinder);
router.get("/get", adminChef, getAllCylinders);
router.get("/export", adminChef, exportCylinders);
router.put("/update/:id", adminChef, updateCylinder);
router.delete("/delete/:id", adminChef, deleteCylinder);

export default router;