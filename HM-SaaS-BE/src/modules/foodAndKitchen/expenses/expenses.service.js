import expenseRepository from "./expenses.repository.js";
import ExcelJS from "exceljs";

class ExpenseService {
  parseDate(input) {
    if (!input) return new Date();
    if (typeof input === 'string' && input.includes("/")) {
      const [dd, mm, yyyy] = input.split("/");
      return new Date(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`);
    }
    const d = new Date(input);
    return isNaN(d) ? new Date() : d;
  }

  async addItems(date, list, tenantId, branchName) {
    const parsedDate = this.parseDate(date);
    const createdExpenses = [];

    for (const item of list) {
      const normalizedItemName = item.itemName.trim();
      const normalizedUnit = item.unit.toLowerCase().trim();
      const quantityNum = Number(item.quantity);

      const expenseEntry = await expenseRepository.createExpense({
        date: parsedDate,
        itemName: normalizedItemName,
        quantity: quantityNum,
        unit: normalizedUnit,
        price: item.price,
        tenantId,
        branchName,
      });
      createdExpenses.push(expenseEntry);

      let inventoryItem =
        await expenseRepository.findInventoryItem(normalizedItemName, tenantId);
      if (!inventoryItem) {
        await expenseRepository.createInventoryItem({
          itemName: normalizedItemName,
          quantity: quantityNum,
          unit: normalizedUnit,
          tenantId,
        });
      } else {
        inventoryItem.quantity += quantityNum;
        if (!inventoryItem.unit) inventoryItem.unit = normalizedUnit;
        await expenseRepository.saveDocument(inventoryItem);
      }
    }
    return createdExpenses;
  }

  async updateItem(id, data, tenantId, branchName) {
    const { date, itemName, quantity, unit, price } = data;
    const inputDate = new Date(date);
    const quantityNum = Number(quantity);
    const cleanItemName = itemName.trim();

    const existingExpense = await expenseRepository.findExpenseById({ _id: id, tenantId });
    if (!existingExpense) throw new Error("NOT_FOUND");

    // Stock Adjustment Logic
    if (existingExpense.itemName !== cleanItemName) {
      const oldInv = await expenseRepository.findInventoryItem(
        existingExpense.itemName,
        tenantId
      );
      if (oldInv) {
        oldInv.quantity -= existingExpense.quantity;
        await expenseRepository.saveDocument(oldInv);
      }
      let newInv = await expenseRepository.findInventoryItem(cleanItemName, tenantId);
      if (!newInv) {
        await expenseRepository.createInventoryItem({
          itemName: cleanItemName,
          quantity: quantityNum,
          unit: unit.trim(),
          tenantId,
        });
      } else {
        newInv.quantity += quantityNum;
        await expenseRepository.saveDocument(newInv);
      }
    } else {
      const inv = await expenseRepository.findInventoryItem(cleanItemName, tenantId);
      if (inv) {
        inv.quantity = inv.quantity - existingExpense.quantity + quantityNum;
        await expenseRepository.saveDocument(inv);
      }
    }

    existingExpense.date = inputDate;
    existingExpense.itemName = cleanItemName;
    existingExpense.quantity = quantityNum;
    existingExpense.unit = unit.trim();
    if (price !== undefined) existingExpense.price = Number(price);
    if (branchName !== undefined) existingExpense.branchName = branchName;

    return await expenseRepository.saveDocument(existingExpense);
  }

  async deleteItem(id, userId, tenantId) {
    const item = await expenseRepository.findExpenseById({ _id: id, tenantId });
    if (!item || item.isdeleted) throw new Error("INVALID");

    const inv = await expenseRepository.findInventoryItem(item.itemName, tenantId);
    if (inv) {
      inv.quantity -= item.quantity;
      if (inv.quantity < 0) inv.quantity = 0;
      await expenseRepository.saveDocument(inv);
    }

    item.isdeleted = true;
    item.deletedinfo = {
      deleteddate: new Date(),
      deleteby: userId,
      module: "kitchenExpense",
    };
    return await expenseRepository.saveDocument(item);
  }

  async generateExcel(items, month, year) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Kitchen Expense");
    sheet.addRow([
      "Sl.No",
      "Date",
      "Item Name",
      "Quantity",
      "Price",
      "Total Amount",
    ]).font = { bold: true };

    items.forEach((item, index) => {
      const totalAmount =
        item.total ?? (item.quantity || 0) * (item.price || 0);
      sheet.addRow([
        index + 1,
        item.date ? new Date(item.date).toLocaleDateString("en-GB") : "",
        item.itemName || "",
        item.quantity || 0,
        item.price || 0,
        totalAmount,
      ]);
    });
    sheet.columns = [
      { width: 8 },
      { width: 15 },
      { width: 30 },
      { width: 12 },
      { width: 12 },
      { width: 15 },
    ];
    return await workbook.xlsx.writeBuffer();
  }

  // Dashboard logic
  async calculateKitchenExpenses(filterDate = new Date(), tenantId, branchName) {
    const dateObj = new Date(filterDate);
    const startOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const endOfMonth = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const items = await expenseRepository.findExpenses({
      tenantId,
      branchName,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });
    return items.reduce((sum, item) => sum + (item.price || 0), 0);
  }
}

export default new ExpenseService();
