import Expense from "./expenses.model.js";
import Inventory from "../inventory/inventory.model.js"; // Assume this path

class ExpenseRepository {
  async createExpense(data) {
    return await Expense.create(data);
  }

  async findExpenses(filter) {
    return await Expense.find(filter).sort({ date: 1 });
  }

  async findExpenseById(filter) {
    return await Expense.findOne(filter);
  }

  async findInventoryItem(itemName, tenantId) {
    return await Inventory.findOne({ itemName, tenantId });
  }

  async createInventoryItem(data) {
    return await Inventory.create(data);
  }

  async saveDocument(doc) {
    return await doc.save();
  }
}

export default new ExpenseRepository();
