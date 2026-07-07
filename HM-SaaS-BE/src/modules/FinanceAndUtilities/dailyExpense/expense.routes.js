import express from "express";
import * as expenseController from "./expense.controller.js";
import protect from "../../../utils/authMiddleware.js";
import { allaccess } from "../../../utils/role.js";

const router = express.Router();

router.use(protect);

router.post("/add", allaccess, expenseController.addDailyExpense);
router.get("/overview", allaccess, expenseController.getExpenseOverview);
router.get("/", allaccess, expenseController.getAllDailyExpenses);
router.put("/update/:id", allaccess, expenseController.updateDailyExpense);
router.delete("/:id", allaccess, expenseController.deleteDailyExpense);
router.get("/export", expenseController.exportDailyExpenseExcel);

export default router;
