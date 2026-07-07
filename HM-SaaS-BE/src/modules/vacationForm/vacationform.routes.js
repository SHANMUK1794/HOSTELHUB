import express from "express";
const router = express.Router();
import protect from "../../utils/authMiddleware.js";

import {
  createVacationForm,
  deleteVacationForm,
  getVacationForms,
  updateVacationForm,
} from "./vacationform.controller.js";
import { adminWarden } from "../../utils/role.js";

router.use(protect);

router.post("/create", protect, adminWarden, createVacationForm);
router.get("/get", protect, adminWarden, getVacationForms);
router.put("/update/:id", protect, adminWarden, updateVacationForm);
router.delete("/delete/:id", protect, adminWarden, deleteVacationForm);

export default router;
