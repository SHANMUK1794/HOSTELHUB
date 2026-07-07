import express from "express";
import expenseController from "./expenses.controller.js";
import protect from "../../../utils/authMiddleware.js";
import { adminChef } from "../../../utils/role.js";

const router = express.Router();

router.use(protect);

router.post("/additem", adminChef, expenseController.addItems);
router.get("/getallitems", adminChef, expenseController.getAllItems);
router.put("/updateitem/:id", adminChef, expenseController.updateItem);
router.delete("/deleteitem/:id", adminChef, expenseController.deleteItem);
router.get("/export", expenseController.exportExcel);

export default router;
