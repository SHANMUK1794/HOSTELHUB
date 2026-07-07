import expenseService from "./expenses.service.js";
import expenseRepository from "./expenses.repository.js";
import { buildDateRangeFilter } from "../../../utils/filter.js";
import mongoose from "mongoose";

class ExpenseController {
  async addItems(req, res) {
    try {
      const { date, list, branchName } = req.body;
      const data = await expenseService.addItems(date, list, req.tenantId, branchName);
      res
        .status(200)
        .json({ success: true, message: "All items added successfully", data });
    } catch (error) {
      console.error("ADD ITEM ERROR:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Internal Server Error",
          error: error.message,
        });
    }
  }

  async getAllItems(req, res) {
    try {
      const { month, year, branchName } = req.query;
      const filter = { ...buildDateRangeFilter(month, year), isdeleted: false, tenantId: req.tenantId };
      if (branchName) filter.branchName = branchName;
      
      const items = await expenseRepository.findExpenses(filter);
      res.status(200).json({ success: true, items });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error." });
    }
  }

  async updateItem(req, res) {
    try {
      const { branchName } = req.body;
      const item = await expenseService.updateItem(req.params.id, req.body, req.tenantId, branchName);
      res
        .status(200)
        .json({
          success: true,
          message: "Expense and inventory updated successfully.",
          item,
        });
    } catch (error) {
      const status = error.message === "NOT_FOUND" ? 404 : 400;
      res.status(status).json({ success: false, message: error.message });
    }
  }

  async deleteItem(req, res) {
    try {
      await expenseService.deleteItem(req.params.id, req.user?._id, req.tenantId);
      res
        .status(200)
        .json({
          success: true,
          message: "Expense item moved to trash and inventory updated.",
        });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async exportExcel(req, res) {
    try {
      const { month, year, branchName } = req.query;
      const filter = { ...buildDateRangeFilter(month, year), isdeleted: false, tenantId: req.tenantId };
      if (branchName) filter.branchName = branchName;
      
      const items = await expenseRepository.findExpenses(filter);

      const buffer = await expenseService.generateExcel(items, month, year);
      const fileName = `Kitchen_Expense_${month || "all"}_${year || "all"}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`,
      );
      res.end(buffer);
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Export Error",
          error: error.message,
        });
    }
  }
}

export default new ExpenseController();
