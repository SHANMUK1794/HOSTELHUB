import Inventory from "./inventory.model.js";
import kitchenHistory from "./kitchenHistory.model.js";
import expenses from "../expenses/expenses.model.js";

/* ================= INVENTORY ================= */

// Find by item name
export const findInventoryByName = (itemName, tenantId) =>
  Inventory.findOne({
    tenantId,
    itemName: { $regex: `^${itemName.trim()}$`, $options: "i" }
  });

// Find by ID
export const findInventoryById = (filter) =>
  Inventory.findOne(filter);

// Get all inventory
export const getAllInventory = (tenantId) =>
  Inventory.find({ tenantId }).sort({ itemName: 1 });

// Save updated inventory document
export const updateInventoryQty = (doc) => doc.save();

// Delete inventory (only used when qty = 0)
export const deleteInventoryById = (filter) =>
  Inventory.findOneAndDelete(filter);


/* ================= HISTORY ================= */

// Create history record
export const createHistory = (data) =>
  kitchenHistory.create(data);

// Find history by ID
export const findHistoryById = (filter) =>
  kitchenHistory.findOne(filter);

// Get history list
export const getHistory = (filter) =>
  kitchenHistory.find(filter).sort({ date: -1 });

// Save updated history document
export const saveHistory = (doc) => doc.save();


/* ================= AGGREGATIONS ================= */

// Total purchased (Make In)
export const getMakeIn = (itemName, dateFilter, tenantId) =>
  expenses.aggregate([
    {
      $match: {
        tenantId,
        itemName: { $regex: `^${itemName.trim()}$`, $options: "i" },
        isdeleted: false,
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: null,
        totalIn: { $sum: "$quantity" },
      },
    },
  ]);

// Total used (Make Out)
export const getMakeOut = (itemName, dateFilter, tenantId) =>
  kitchenHistory.aggregate([
    {
      $match: {
        tenantId,
        itemName: { $regex: `^${itemName.trim()}$`, $options: "i" },
        isdeleted: false,
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: null,
        totalOut: { $sum: "$used" },
      },
    },
  ]);