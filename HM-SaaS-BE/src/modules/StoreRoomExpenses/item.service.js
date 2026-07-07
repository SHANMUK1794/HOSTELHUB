import * as repo from "./item.repository.js";
import { buildDateRangeFilter } from "../../utils/filter.js";
import ExcelJS from "exceljs";

export const addItemService = async ({ date, itemName, quantity, price, branchName }, tenantId) => {
  if (!date?.trim() || !itemName?.trim() || quantity == null || price == null) {
    throw new Error("Please fill all required fields");
  }

  const quantityNum = Number(quantity);
  if (isNaN(quantityNum) || quantityNum <= 0) {
    throw new Error("Quantity must be a valid positive number");
  }

  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum < 0) {
    throw new Error("Price must be a valid positive number");
  }

  const cleanItemName = itemName.trim();
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate > today) {
    throw new Error("Future dates are not allowed");
  }

  const parsedDate = date.includes("/")
    ? (() => {
        const [dd, mm, yyyy] = date.split("/");
        return new Date(`${yyyy}-${mm}-${dd}`);
      })()
    : new Date(date);

  const expenseEntry = await repo.createExpense({
    date: parsedDate,
    itemName: cleanItemName,
    quantity: quantityNum,
    price: priceNum,
    branchName,
    tenantId,
  });

  const existingHistory = await repo.findHistoryByItemName(cleanItemName, tenantId, branchName);
  if (!existingHistory) {
    await repo.createHistory({
      itemName: cleanItemName,
      quantity: quantityNum,
      tenantId,
      branchName,
    });
  } else {
    existingHistory.quantity += quantityNum;
    await existingHistory.save();
  }

  return expenseEntry;
};

export const getAllItemsService = async ({ month, year, branchName }, tenantId) => {
  const filter = buildDateRangeFilter(month, year);
  const finalFilter = { ...filter, isdeleted: false, tenantId, ...(branchName && { branchName }) };
  return await repo.findExpenses(finalFilter);
};

export const updateItemService = async (id, updateData, tenantId) => {
  if (!id) throw new Error("Item ID required");

  const oldExpense = await repo.findExpenseById({ _id: id, tenantId });
  if (!oldExpense) throw new Error("Expense item not found");

  const oldName = oldExpense.itemName;
  const oldQty = Number(oldExpense.quantity);

  if (updateData.quantity !== undefined) {
    const qNum = Number(updateData.quantity);
    if (isNaN(qNum) || qNum <= 0)
      throw new Error("Quantity must be a positive number");
  }

  const newName = updateData.itemName ? updateData.itemName.trim() : oldName;
  const newQty = updateData.quantity ? Number(updateData.quantity) : oldQty;

  if (updateData.price !== undefined) {
    const pNum = Number(updateData.price);
    if (isNaN(pNum) || pNum < 0)
      throw new Error("Price must be a positive number");
  }

  delete updateData.pricePerUnit;

  if (newName !== oldName) {
    const oldHistory = await repo.findHistoryByItemName(oldName, tenantId);
    if (oldHistory) {
      oldHistory.quantity = Math.max(0, oldHistory.quantity - oldQty);
      await oldHistory.save();
    }

    let newHistory = await repo.findHistoryByItemName(newName, tenantId);
    if (!newHistory) {
      await repo.createHistory({ itemName: newName, quantity: newQty, tenantId });
    } else {
      newHistory.quantity += newQty;
      await newHistory.save();
    }
  } else {
    const diff = newQty - oldQty;
    const historyRecord = await repo.findHistoryByItemName(oldName, tenantId);
    if (historyRecord) {
      historyRecord.quantity = Math.max(0, historyRecord.quantity + diff);
      await historyRecord.save();
    }
  }

  return await repo.updateExpenseById({ _id: id, tenantId }, {
    ...updateData,
    itemName: newName,
    quantity: newQty,
  });
};

export const deleteItemService = async (id, userId, tenantId) => {
  const expense = await repo.findExpenseById({ _id: id, tenantId });
  if (!expense) throw new Error("Item not found in expense list");
  if (expense.isdeleted) throw new Error("Item already deleted");

  expense.isdeleted = true;
  expense.deletedinfo = {
    deleteddate: new Date(),
    deleteby: userId || null,
    module: "StoreRoom",
  };
  await expense.save();

  const storeroom = await repo.findHistoryByItemName(expense.itemName, tenantId);
  if (storeroom) {
    storeroom.quantity = Math.max(0, storeroom.quantity - expense.quantity);
    await storeroom.save();
  }

  return true;
};

export const exportSummaryService = async (query, tenantId) => {
  const data = await getAllItemsService(query, tenantId);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Store Room Purchase");
  sheet.addRow(["S.No", "Date", "Description", "Quantity", "Price"]).font = {
    bold: true,
  };
  
  data.forEach((item, index) => {
    sheet.addRow([
      index + 1,
      item.date ? new Date(item.date).toLocaleDateString("en-GB") : "",
      item.itemName,
      item.quantity,
      item.price,
    ]);
  });
  
  sheet.columns = [
    { width: 8 },
    { width: 15 },
    { width: 30 },
    { width: 15 },
    { width: 15 },
  ];
  
  return workbook;
};
