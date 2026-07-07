import * as repo from "./inventory.repository.js";
import { buildDateRangeFilter } from "../../../utils/filter.js";
import ExcelJS from "exceljs";

/* ================= ADD ITEM ================= */
export const addItemService = async (body, tenantId) => {
  const { date, itemName, used } = body;

  if (!date?.trim() || !itemName?.trim() || !used) {
    throw new Error("Please fill all the required fields");
  }

  const inputDate = new Date(date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate > today) {
    throw new Error("Future dates are not allowed");
  }

  // parse date
  const parseDate = (input) => {
    if (input.includes("/")) {
      const [dd, mm, yyyy] = input.split("/");
      return new Date(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`);
    }
    return new Date(input);
  };

  const parsedDate = parseDate(date);

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format. Use dd/mm/yyyy or yyyy-mm-dd.");
  }

  const normalizedItemName = itemName.trim().toLowerCase();
  const usedNum = Number(used);

  if (isNaN(usedNum) || usedNum <= 0) {
    throw new Error("Used quantity must be a valid positive number");
  }

  const existingInventory = await repo.findInventoryByName(normalizedItemName, tenantId);

  if (!existingInventory) {
    throw new Error("Item not found in inventory");
  }

  const currentQuantity = existingInventory.quantity;
  const balance = currentQuantity - usedNum;

  if (balance < 0) {
    throw new Error(`Insufficient stock. Only ${currentQuantity} left in inventory.`);
  }

  const usageLog = await repo.createHistory({
    date: parsedDate,
    itemName: normalizedItemName,
    quantity: currentQuantity,
    used: usedNum,
    balance,
    tenantId,
  });

  existingInventory.quantity = balance;
  await repo.updateInventoryQty(existingInventory);

  return usageLog;
};


/* ================= DELETE HISTORY ================= */
export const deleteItemService = async (id, user, tenantId) => {

  const usageRecord = await repo.findHistoryById({ _id: id, tenantId });

  if (!usageRecord) {
    throw new Error("Kitchen history record not found.");
  }

  if (usageRecord.isdeleted) {
    throw new Error("This usage record is already deleted.");
  }

  const inventoryItem = await repo.findInventoryByName(usageRecord.itemName, tenantId);

  if (inventoryItem) {
    inventoryItem.quantity += usageRecord.used;
    await repo.updateInventoryQty(inventoryItem);
  }

  usageRecord.isdeleted = true;
  usageRecord.deletedinfo = {
    deleteddate: new Date(),
    deleteby: user?._id || null,
    module: "kitchenInventory",
  };

  await repo.saveHistory(usageRecord);

  return true;
};


/* ================= GET HISTORY ================= */
// ✅ FIXED PARAM ORDER
export const getAllItemsService = async (year, month, tenantId) => {

  const filter = buildDateRangeFilter(month, year);
  const finalFilter = { ...filter, tenantId, isdeleted: false };

  const items = await repo.getHistory(finalFilter);

  return items;
};


/* ================= GET INVENTORY ================= */
export const getItemsService = async (year, month, tenantId) => {

  let startDate = null;
  let endDate = null;
  let applyDateFilter = false;

  if (year && month && year !== "all" && month !== "all") {
    applyDateFilter = true;

    let monthNumber;

    if (month.includes("-")) {
      const [y, m] = month.split("-");
      year = Number(y);
      monthNumber = Number(m);
    } else if (isNaN(month)) {
      monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
    } else {
      monthNumber = Number(month);
    }

    startDate = new Date(Number(year), monthNumber - 1, 1);
    endDate = new Date(Number(year), monthNumber, 1);
  }

  const dateFilter = applyDateFilter
    ? { date: { $gte: startDate, $lt: endDate } }
    : {};

  const items = await repo.getAllInventory(tenantId);

  const responseItems = [];

  for (let index = 0; index < items.length; index++) {
    const item = items[index];

    const makeIn = await repo.getMakeIn(item.itemName, dateFilter, tenantId);
    const makeOut = await repo.getMakeOut(item.itemName, dateFilter, tenantId);

    responseItems.push({
      sno: index + 1,
      id: item._id,
      itemName: item.itemName,
      quantity: item.quantity,
      makeIn: makeIn.length ? makeIn[0].totalIn : 0,
      makeOut: makeOut.length ? makeOut[0].totalOut : 0,
    });
  }

  return {
    year: year || "all",
    month: month || "all",
    data: responseItems,
  };
};


/* ================= UPDATE ITEM ================= */
export const updateItemService = async (id, body, tenantId) => {

  const { date, itemName, used } = body;

  const existingHistory = await repo.findHistoryById({ _id: id, tenantId });

  if (!existingHistory) {
    throw new Error("Kitchen history record not found.");
  }

  const inputDate = new Date(date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate > today) {
    throw new Error("Future dates are not allowed");
  }

  // ✅ FIXED (removed toLowerCase for consistency)
  const normalizedItemName =
  itemName?.trim().toLowerCase() || existingHistory.itemName;

  const existingInventory = await repo.findInventoryByName(normalizedItemName, tenantId);

  if (!existingInventory) {
    throw new Error("Inventory item not found.");
  }

  const prevUsed = existingHistory.used;
  const newUsed = used !== undefined ? Number(used) : prevUsed;

  if (isNaN(newUsed) || newUsed <= 0) {
    throw new Error("Used quantity must be a valid positive number.");
  }

  const quantity = existingInventory.quantity + prevUsed;
  const newBalance = quantity - newUsed;

  if (newBalance < 0) {
    throw new Error(
      `Insufficient inventory. Only ${quantity} available including previously used.`
    );
  }

  existingHistory.date = date || existingHistory.date;
  existingHistory.itemName = normalizedItemName;
  existingHistory.used = newUsed;
  existingHistory.quantity = quantity;
  existingHistory.balance = newBalance;

  await repo.saveHistory(existingHistory);

  existingInventory.quantity = newBalance;
  await repo.updateInventoryQty(existingInventory);

  return existingHistory;
};


/* ================= DELETE INVENTORY ================= */
export const deleteInventoryService = async (id, tenantId) => {

  const item = await repo.findInventoryById({ _id: id, tenantId });

  if (!item) {
    throw new Error("Item not found");
  }

  if (item.quantity !== 0) {
    throw new Error("Cannot delete item. Quantity must be 0.");
  }

  await repo.deleteInventoryById({ _id: id, tenantId });

  return true;
};


/* ================= EXPORT EXCEL ================= */
export const exportInventoryService = async (year, month, tenantId) => {

  let startDate = null;
  let endDate = null;
  let applyDateFilter = false;

  if (year && month && year !== "all" && month !== "all") {
    applyDateFilter = true;

    let monthNumber;

    if (month.includes("-")) {
      const [y, m] = month.split("-");
      year = Number(y);
      monthNumber = Number(m);
    } else if (isNaN(month)) {
      monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;
    } else {
      monthNumber = Number(month);
    }

    startDate = new Date(Number(year), monthNumber - 1, 1);
    endDate = new Date(Number(year), monthNumber, 1);
  }

  const dateFilter = applyDateFilter
    ? { date: { $gte: startDate, $lt: endDate } }
    : {};

  const items = await repo.getAllInventory(tenantId);

  if (!items.length) {
    throw new Error("No inventory items found");
  }

  const rows = [];

  for (let index = 0; index < items.length; index++) {
    const item = items[index];

    const makeIn = await repo.getMakeIn(item.itemName, dateFilter, tenantId);
    const makeOut = await repo.getMakeOut(item.itemName, dateFilter, tenantId);

    rows.push({
      sno: index + 1,
      description: item.itemName,
      makeIn: makeIn.length ? makeIn[0].totalIn : 0,
      makeOut: makeOut.length ? makeOut[0].totalOut : 0,
      stock: item.quantity || 0,
    });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Kitchen Inventory");

  sheet.addRow([
    "S_No",
    "Description",
    "MakeIn",
    "MakeOut",
    "Stock",
  ]).font = { bold: true };

  rows.forEach((row) => {
    sheet.addRow([
      row.sno,
      row.description,
      row.makeIn,
      row.makeOut,
      row.stock,
    ]);
  });

  sheet.columns = [
    { width: 8 },
    { width: 30 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();

  return {
    buffer,
    fileName: `Kitchen_Inventory_${month || "all"}_${year || "all"}.xlsx`,
  };
};