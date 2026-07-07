import storeRoomExpense from "../../modules/StoreRoomExpenses/item.model.js";
import storeRoomHistory from "../../modules/StoreRoomInventory/inventoryHistory.model.js";

export const createExpense = (data) => storeRoomExpense.create(data);

export const findExpenses = (filter) => storeRoomExpense.find(filter);

export const findExpenseById = (filter) => storeRoomExpense.findOne(filter);

export const updateExpenseById = (filter, updateData) =>
  storeRoomExpense.findOneAndUpdate(filter, { $set: updateData }, { new: true });

export const findHistoryByItemName = (itemName, tenantId, branchName) =>
  storeRoomHistory.findOne({ itemName, tenantId, branchName });

export const createHistory = (data) => storeRoomHistory.create(data);
