import * as expenseService from "./expense.service.js";
import * as expenseRepo from "./expense.repository.js";

export const addDailyExpense = async (req, res) => {
  try {
    const data = await expenseService.addExpense(req.body, req.user, req.tenantId);
    res.status(200).json({ success: true, message: "Daily Expense added successfully", data });
  } catch (error) {
    res.status(error.message.includes("fill") ? 400 : 500).json({ success: false, error: error.message });
  }
};

export const getAllDailyExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getExpenses(req.user, req.query);
    res.status(200).json({ success: true, message: "Daily Expenses retrieved successfully", data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getExpenseOverview = async (req, res) => {
  try {
    const { branchName, year } = req.query;
    const data = await expenseService.getExpenseOverviewGraphData(req.tenantId, branchName, year, req.user);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDailyExpense = async (req, res) => {
  try {
    const data = await expenseService.updateExpense(req.params.id, req.body, req.user, req.tenantId);
    res.status(200).json({ success: true, message: "Daily Expense updated successfully", data });
  } catch (error) {
    const status = error.message.includes("Denied") ? 403 : (error.message.includes("not found") ? 404 : 400);
    res.status(status).json({ success: false, message: error.message });
  }
};



export const deleteDailyExpense = async (req, res) => {
  try {
    const expense = await expenseRepo.findById({ _id: req.params.id, tenantId: req.tenantId });
    if (!expense) {
      return res.status(404).json({ success: false, message: "Daily Expense not found" });
    }

    // 👉 CHANGED FROM HARD DELETE TO SAFELY UPDATING FLAGS (Soft Delete)
    expense.isdeleted = true;
    expense.deletedinfo = {
      deleteddate: new Date(),
      deleteby: req.user?._id || null, // Saves the logged-in Admin/Warden's ID
      module: "daily_expense",         // Maps perfectly to the Recycle Bin dictionary
    };

    await expense.save();

    res.status(200).json({ 
      success: true, 
      message: "Daily Expense successfully moved to Recycle Bin" 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const exportDailyExpenseExcel = async (req, res) => {
  try {
    const { buffer, fileName } = await expenseService.exportExcel(req.user, req.query);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.end(buffer);
  } catch (error) {
    res.status(error.message.includes("Found") ? 404 : 500).json({ success: false, message: error.message });
  }
};