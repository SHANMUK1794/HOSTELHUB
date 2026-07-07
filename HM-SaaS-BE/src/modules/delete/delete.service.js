import * as deleteRepository from "./delete.repository.js";
import user from "../userController/auth.model.js";
import { buildBranchFilter } from "../../utils/filter.js";

// 👉 FIXED: All lookup dictionary properties standardized to strict lowercase tags
const moduleNameMap = {
  register: "Register",
  employee: "Employees",
  achievement: "Achievements",
  user: "Users Roles",
  storeroomexpense: "Store Room",
  storeroominventory: "Store Room",
  kitchenexpense: "Kitchen",
  kitcheninventory: "Kitchen",
  cylinder: "Kitchen",
  
  // Standardized finance modules map lookup configurations
  advance: "Finance & Utilities",
  expense: "Finance & Utilities",
  dailyexpense: "Finance & Utilities",
  duetracker: "Finance & Utilities",
  electricitybill: "Finance & Utilities",
  incomingfund: "Finance & Utilities",
  payroll: "Finance & Utilities",
  roomrent: "Finance & Utilities",
  complaint: "Complaints", 
};

const cleanString = (str) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const getFilterForBranchlessModule = (branchName, module, tenantId) => {
  const genericDeletedFilter = {
    tenantId,
    $or: [
      { isdeleted: true },
      { "deletedinfo.deleteddate": { $ne: null } }
    ]
  };
  // Kitchen and StoreRoom are global per tenant.
  // We ALWAYS want to return the tenant scoped filter so they appear in the recycle bin for the active tenant,
  // and we NEVER want to return null because find(null) will fetch everything across all tenants.
  return genericDeletedFilter;
};

export const getRecentDeletedService = async (userData, branchName, moduleQuery, tenantId) => {
  const branchFilter = buildBranchFilter(userData, branchName);
  const baseFilter = { ...branchFilter, isdeleted: true, tenantId };
  
  const financeFilter = {
    ...branchFilter,
    tenantId,
    $or: [
      { isdeleted: true },
      { "deletedinfo.deleteddate": { $exists: true, $ne: null } },
    ],
  };

  const [
    regs, emps, achs, usrs, sExp, sInv, kExp, kInv, kCyl, 
    A_FinUtil, E_FinUtil, DT_FinUtil, EB_FinUtil, F_FinUtil, P_FinUtil, RR_FinUtil, 
    comp
  ] = await Promise.all([
    deleteRepository.moduleGroups.Register[0].find(baseFilter),
    deleteRepository.moduleGroups.Employees[0].find(baseFilter),
    deleteRepository.moduleGroups.Achievements[0].find(baseFilter),
    deleteRepository.moduleGroups.UsersRoles[0].find(baseFilter),
    deleteRepository.moduleGroups.StoreRoom[0].find(getFilterForBranchlessModule(branchName, "StoreRoom", tenantId)),
    deleteRepository.moduleGroups.StoreRoom[1].find(getFilterForBranchlessModule(branchName, "StoreRoom", tenantId)),
    deleteRepository.moduleGroups.KitchenInventory[0].find(getFilterForBranchlessModule(branchName, "KitchenInventory", tenantId)),
    deleteRepository.moduleGroups.KitchenInventory[1].find(getFilterForBranchlessModule(branchName, "KitchenInventory", tenantId)),
    deleteRepository.moduleGroups.KitchenInventory[2].find({ isdeleted: true }),
    
    deleteRepository.moduleGroups.FinanceUtilities[0].find(financeFilter),
    deleteRepository.moduleGroups.FinanceUtilities[1].find(financeFilter),
    deleteRepository.moduleGroups.FinanceUtilities[2].find(financeFilter),
    deleteRepository.moduleGroups.FinanceUtilities[3].find(financeFilter),
    deleteRepository.moduleGroups.FinanceUtilities[4].find(financeFilter),
    deleteRepository.moduleGroups.FinanceUtilities[5].find(financeFilter),
    deleteRepository.moduleGroups.FinanceUtilities[6].find(financeFilter),
    deleteRepository.moduleGroups.Complaints[0].find(baseFilter),
  ]);

  const format = async (items, modKey) => {
    const results = [];
    if (!items || !Array.isArray(items)) return results;
    
    // 👉 FIXED: Normalize the lookup key before checking moduleNameMap
    const processedLookupKey = cleanString(modKey);
    const resolvedModuleName = moduleNameMap[processedLookupKey] || "Finance & Utilities";

    for (const item of items) {
      const deletedByUser = item?.deletedinfo?.deleteby
        ? await user.findById(item.deletedinfo.deleteby).select("staffName")
        : null;
        
      let itemName =
        item.Name ||
        item.name ||
        item.staffName ||
        item.itemName ||
        item.staff_name ||
        item.UserName ||
        item.ResidentName ||
        item.work ||
        (processedLookupKey === "cylinder"
          ? `Gas Cylinder (${item.capacity} kg)`
          : processedLookupKey === "complaint"
            ? `${item.issue}${item.room_no ? ` (Room ${item.room_no})` : ""}`
            : "Unknown");
        
      results.push({
        _id: item._id,
        module: resolvedModuleName, // Enforces output maps smoothly to "Finance & Utilities"
        itemName,
        deleteddate: item.deletedinfo?.deleteddate || null,
        deletedByName: deletedByUser?.staffName || null,
      });
    }
    return results;
  };

  let finalList = [
    ...(await format(regs, "register")),
    ...(await format(emps, "employee")),
    ...(await format(achs, "achievement")),
    ...(await format(usrs, "user")),
    ...(await format(sExp, "storeRoomExpense")),
    ...(await format(sInv, "storeRoomInventory")),
    ...(await format(kExp, "kitchenExpense")),
    ...(await format(kInv, "kitchenInventory")),
    ...(await format(kCyl, "cylinder")),
    ...(await format(A_FinUtil, "advance")),
    ...(await format(E_FinUtil, "daily_expense")),
    ...(await format(DT_FinUtil, "duetracker")),
    ...(await format(EB_FinUtil, "electricitybill")),
    ...(await format(F_FinUtil, "incomingfund")),
    ...(await format(P_FinUtil, "payroll")),
    ...(await format(RR_FinUtil, "roomrent")),
    ...(await format(comp, "complaint")),
  ];

  if (moduleQuery) {
    const queryGroup = cleanString(moduleQuery);
    if (queryGroup !== "all") {
      finalList = finalList.filter((item) => {
        const itemMod = cleanString(item.module);
        if (queryGroup.includes("finance") && itemMod.includes("finance")) return true;
        return itemMod === queryGroup || itemMod.includes(queryGroup) || queryGroup.includes(itemMod);
      });
    }
  }

  return finalList.sort((a, b) => new Date(b.deleteddate) - new Date(a.deleteddate));
};

export const recoverDeletedService = async (id, moduleName, tenantId) => {
  const normalized = cleanString(moduleName);
  let groupKey = "FinanceUtilities";
  
  if (normalized.includes("complaint")) groupKey = "Complaints";
  else if (normalized.includes("store")) groupKey = "StoreRoom";
  else if (normalized.includes("kitchen")) groupKey = "KitchenInventory";
  else if (normalized.includes("user")) groupKey = "UsersRoles";
  else if (normalized.includes("register")) groupKey = "Register";
  else if (normalized.includes("employee")) groupKey = "Employees";
  else if (normalized.includes("achievement")) groupKey = "Achievements";

  const models = deleteRepository.moduleGroups[groupKey];
  if (!models) throw new Error(`Unknown module group lookup: ${moduleName}`);

  const { record, ModelUsed } = await deleteRepository.findByIdInModels(models, { _id: id, tenantId });
  if (!record) throw new Error(`${moduleName} item record not found`);

  const history = await deleteRepository.findHistory(groupKey, record.itemName, tenantId, record.branchName);
  if (history) {
    const isExpense = ModelUsed.modelName.toLowerCase().includes("expense");
    if (isExpense) history.quantity += record.quantity;
    else {
      history.quantity -= record.used;
      if (history.quantity < 0) history.quantity = 0;
    }
    await history.save();
  }

  if (record.isdeleted !== undefined) record.isdeleted = false;
  if (record.deletedinfo) {
    record.deletedinfo.deleteddate = null;
    record.deletedinfo.deleteby = null;
  }
  return await record.save();
};

export const permanentDeleteService = async (id, moduleName, tenantId) => {
  const normalized = cleanString(moduleName);
  let groupKey = "FinanceUtilities";
  
  if (normalized.includes("complaint")) groupKey = "Complaints";
  else if (normalized.includes("store")) groupKey = "StoreRoom";
  else if (normalized.includes("kitchen")) groupKey = "KitchenInventory";
  else if (normalized.includes("user")) groupKey = "UsersRoles";
  else if (normalized.includes("register")) groupKey = "Register";
  else if (normalized.includes("employee")) groupKey = "Employees";
  else if (normalized.includes("achievement")) groupKey = "Achievements";

  const models = deleteRepository.moduleGroups[groupKey];
  if (!models) throw new Error(`Unknown module group lookup: ${moduleName}`);

  const { record, ModelUsed } = await deleteRepository.findByIdInModels(models, { _id: id, tenantId });
  if (!record) throw new Error(`${moduleName} item instance not found`);

  if (ModelUsed.modelName === "Cylinder") {
    await ModelUsed.findByIdAndDelete(id);
  } else {
    await ModelUsed.findOneAndDelete({ _id: id, tenantId });
  }
  return true;
};

export const deleteAllTrashService = async (userData, branchName, targetModule = null, tenantId) => {
  const results = {};
  const branchFilter = buildBranchFilter(userData, branchName);
  const baseFilter = { 
    ...branchFilter, 
    tenantId,
    $or: [
      { isdeleted: true }, 
      { "deletedinfo.deleteddate": { $exists: true, $ne: null } }
    ] 
  };

  let groupKey = null;
  if (targetModule) {
    const normalized = cleanString(targetModule);
    if (normalized.includes("finance")) groupKey = "FinanceUtilities";
    else if (normalized.includes("complaint")) groupKey = "Complaints";
    else if (normalized.includes("store")) groupKey = "StoreRoom";
    else if (normalized.includes("kitchen")) groupKey = "KitchenInventory";
    else if (normalized.includes("user")) groupKey = "UsersRoles";
    else if (normalized.includes("register")) groupKey = "Register";
    else if (normalized.includes("employee")) groupKey = "Employees";
    else if (normalized.includes("achievement")) groupKey = "Achievements";
  }

  const groups = groupKey ? { [groupKey]: deleteRepository.moduleGroups[groupKey] } : deleteRepository.moduleGroups;

  for (const modName in groups) {
    let totalDeleted = 0;
    for (const Model of groups[modName]) {
      let filter = ["Register", "Employees", "Achievements", "UsersRoles"].includes(modName)
        ? baseFilter
        : getFilterForBranchlessModule(branchName, modName, tenantId);

      if (Model.modelName === "Cylinder") {
        filter = { isdeleted: true };
      }

      if (!filter) continue;
      const res = await deleteRepository.deleteManyRecords(Model, filter);
      totalDeleted += res.deletedCount;
    }
    results[modName] = totalDeleted;
  }
  return results;
};