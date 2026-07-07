import express from "express";
import * as payrollController from "./payroll.controller.js";
import protect from "../../../utils/authMiddleware.js";
import { adminOnly } from "../../../utils/role.js";

const router = express.Router();

router.use(protect);

router.post("/add", adminOnly, payrollController.addPayroll);
router.post("/getinfo", adminOnly, payrollController.getEmpDetails);
router.get("/all", adminOnly, payrollController.getAllPayrolls);
router.put("/update/:id", adminOnly, payrollController.updatePayroll);
router.get("/payroll/export", adminOnly, payrollController.exportPayrollExcel);
router.delete("/delete/:id", adminOnly, payrollController.deletePayroll);

export default router;
