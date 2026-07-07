import * as repo from "./inventory.repository.js";
import { buildDateRangeFilter } from "../../utils/filter.js";
import ExcelJS from "exceljs";

export const addItemService = async (userData, body, tenantId) => {
  const { date, itemName, used } = body;
  const branchName =
    userData.role === "Admin" ? body.branchName : userData.branchName;

  if (
    !date?.trim() ||
    !itemName?.trim() ||
    used == null ||
    !branchName?.trim()
  ) {
    throw new Error("Please fill all the required fields");
  }

  const usedQty = Number(used);
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate > today) throw new Error("Future dates are not allowed");

  const parsedDate = new Date(
    date.includes("/") ? date.split("/").reverse().join("-") : date,
  );
  const storeRoom = await repo.findHistoryByItemName(itemName.trim(), tenantId, branchName);

  if (!storeRoom) throw new Error("Item not found in history");
  if (storeRoom.quantity < usedQty)
    throw new Error(
      `Insufficient stock. Only ${storeRoom.quantity} available.`,
    );

  const balance = storeRoom.quantity - usedQty;
  const result = await repo.createInventory({
    date: parsedDate,
    itemName: itemName.trim(),
    quantity: storeRoom.quantity,
    used: usedQty,
    balance,
    branchName,
    tenantId,
  });

  storeRoom.quantity = balance;
  await storeRoom.save();
  return result;
};

export const getAllItemsService = async (query, tenantId) => {
  const filter = buildDateRangeFilter(query.month, query.year);
  const branchNameFilter = query.branchName ? { branchName: query.branchName } : {};
  return await repo.findInventory({ ...filter, ...branchNameFilter, isdeleted: false, tenantId });
};

export const getItemsHistoryService = async (query, tenantId) => {
  const dateFilter = buildDateRangeFilter(query.month, query.year);

  const items = await repo.findAllHistory({ tenantId, branchName: query.branchName });
  const responseItems = [];

  for (let item of items) {
    const makeIn = await repo.aggregateExpenses({
      itemName: item.itemName,
      isdeleted: false,
      tenantId,
      branchName: query.branchName,
      ...dateFilter,
    });
    const makeOut = await repo.aggregateInventory({
      itemName: item.itemName,
      isdeleted: false,
      tenantId,
      branchName: query.branchName,
      ...dateFilter,
    });

    const totalIn = makeIn[0]?.totalIn || 0;
    const totalOut = makeOut[0]?.totalOut || 0;

    if (Object.keys(dateFilter).length > 0 && totalIn === 0 && totalOut === 0) {
      continue;
    }

    responseItems.push({
      id: item._id,
      itemName: item.itemName,
      quantity: item.quantity,
      makeIn: totalIn,
      makeOut: totalOut,
    });
  }

  // Reassign serial numbers after filtering
  responseItems.forEach((item, index) => {
    item.sno = index + 1;
  });

  return responseItems;
};

export const updateItemService = async (id, updateData, tenantId) => {
  if (updateData.date) {
    const inputDate = new Date(updateData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    if (inputDate > today) throw new Error("Future dates are not allowed");
  }

  const getItem = await repo.findInventoryById({ _id: id, tenantId });
  if (!getItem) throw new Error("Item not found");

  const history = await repo.findHistoryByItemName(updateData.itemName, tenantId, getItem.branchName);
  if (!history) throw new Error("Item not found in history");

  let newTotalQuantity = history.quantity + getItem.used;
  const balance = newTotalQuantity - updateData.used;
  if (balance < 0) throw new Error("Insufficient quantity");

  updateData.balance = balance;
  updateData.quantity = newTotalQuantity;

  const updated = await repo.updateInventoryById({ _id: id, tenantId }, updateData);
  history.quantity = balance;
  await history.save();
  return updated;
};

export const deleteItemService = async (id, userId, tenantId) => {
  const del = await repo.findInventoryById({ _id: id, tenantId });
  if (!del || del.isdeleted)
    throw new Error("Item not found or already deleted");

  del.isdeleted = true;
  del.deletedinfo = {
    deleteddate: new Date(),
    deleteby: userId,
    module: "StoreRoom",
  };
  await del.save();

  const history = await repo.findHistoryByItemName(del.itemName, tenantId, del.branchName);
  if (history) {
    history.quantity += del.used;
    await history.save();
  }
  return true;
};

export const hardDeleteHistoryService = async (id, tenantId) => {
  const item = await repo.findHistoryById({ _id: id, tenantId });
  if (!item) throw new Error("Item not found");
  if (item.quantity !== 0)
    throw new Error("Cannot delete item. Quantity must be 0.");
  return await repo.deleteHistoryById({ _id: id, tenantId });
};

export const exportSummaryService = async (query, tenantId) => {
  // Re-uses logic from getItemsHistoryService but formatted for ExcelJS
  const data = await getItemsHistoryService(query, tenantId);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Store Room Stock");
  sheet.addRow(["S_No", "Description", "MakeIn", "MakeOut", "Stock"]).font = {
    bold: true,
  };
  data.forEach((r) =>
    sheet.addRow([r.sno, r.itemName, r.makeIn, r.makeOut, r.quantity]),
  );
  return workbook;
};