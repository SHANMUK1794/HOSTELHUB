import storeRoomInventory from "./inventory.model.js";
import storeRoomHistory from "./inventoryHistory.model.js";
import storeRoomExpense from "../StoreRoomExpenses/item.model.js";

export const createInventory = (data) => storeRoomInventory.create(data);

export const findInventory = (filter) => storeRoomInventory.find(filter);

export const findInventoryById = (filter) => storeRoomInventory.findOne(filter);

export const findHistoryByItemName = (itemName, tenantId, branchName) =>
  storeRoomHistory.findOne({ itemName, tenantId, branchName });

export const findHistoryById = (filter) => storeRoomHistory.findOne(filter);

export const deleteHistoryById = (filter) => storeRoomHistory.findOneAndDelete(filter);

export const findAllHistory = (filter = {}) =>
  storeRoomHistory.find(filter).sort({ itemName: 1 });

export const updateInventoryById = (filter, data) =>
  storeRoomInventory.findOneAndUpdate(filter, { $set: data }, { new: true });

export const aggregateExpenses = (matchFilter) =>
  storeRoomExpense.aggregate([
    { $match: matchFilter },
    { $group: { _id: null, totalIn: { $sum: "$quantity" } } },
  ]);

export const aggregateInventory = (matchFilter) =>
  storeRoomInventory.aggregate([
    { $match: matchFilter },
    { $group: { _id: null, totalOut: { $sum: "$used" } } },
  ]);