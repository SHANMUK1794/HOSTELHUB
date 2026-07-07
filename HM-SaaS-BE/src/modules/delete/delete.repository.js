// import register from "../../modules/register/register.model.js";
// import achievements from "../../modules/achievement/achievement.model.js";
// import employee from "../employee/employee.model.js";
// import user from "../userController/auth.model.js";
// import storeRoomExpense from "../../modules/StoreRoomExpenses/item.model.js";
// import storeRoomInventory from "../../modules/StoreRoomInventory/inventory.model.js";
// import kitchenExpense from "../../modules/foodAndkitchen/expenses/expenses.model.js";
// import kitchenInventory from "../../modules/foodAndkitchen/inventory/inventory.model.js";
// import storeRoomHistory from "../../modules/StoreRoomInventory/inventoryHistory.model.js";
// import kitchenHistory from "../../modules/foodAndkitchen/inventory/kitchenHistory.model.js";

// import advance from "../../modules/FinanceAndUtilities/advance/advance.model.js"; 
// import dailyExpense from "../../modules/FinanceAndUtilities/dailyExpense/expense.model.js";
// import dueTracker from "../../modules/FinanceAndUtilities/dueTracker/dueTracker.model.js";
// import electricityBill from "../../modules/FinanceAndUtilities/ElectricityBill/ebill.model.js";
// import incomingFund from "../../modules/FinanceAndUtilities/Fund/fund.model.js";
// import payroll from "../../modules/FinanceAndUtilities/Payroll/payroll.model.js";
// import roomRent from "../../modules/FinanceAndUtilities/RoomRent/roomRent.model.js";
// import complaint from "../../modules/complaints/complaint.model.js";

// export const moduleGroups = {
//   Register: [register],
//   Employees: [employee],
//   Achievements: [achievements],
//   UsersRoles: [user],
//   StoreRoom: [storeRoomExpense, storeRoomInventory],
//   KitchenInventory: [kitchenExpense, kitchenInventory],

//   FinanceUtilities: [
//     advance, 
//     dailyExpense, 
//     dueTracker, 
//     electricityBill, 
//     incomingFund, 
//     payroll, 
//     roomRent
//   ],
//   Complaints: [complaint],

// };

// export const findHistory = (module, itemName) => {
//   if (module === "StoreRoom") return storeRoomHistory.findOne({ itemName });
//   if (module === "KitchenInventory")
//     return kitchenHistory.findOne({ itemName });
//   return null;
// };

// export const findByIdInModels = async (models, id) => {
//   for (const Model of models) {
//     const record = await Model.findById(id);
//     if (record) return { record, ModelUsed: Model };
//   }
//   return { record: null, ModelUsed: null };
// };

// export const deleteManyRecords = (Model, filter) => Model.deleteMany(filter);

// export const getAllDeletedFromModels = (Model, filter) => Model.find(filter);
import register from "../../modules/register/register.model.js";
import achievements from "../../modules/achievement/achievement.model.js";
import employee from "../employee/employee.model.js";
import user from "../userController/auth.model.js";
import storeRoomExpense from "../../modules/StoreRoomExpenses/item.model.js";
import storeRoomInventory from "../../modules/StoreRoomInventory/inventory.model.js";
import kitchenExpense from "../../modules/foodAndKitchen/expenses/expenses.model.js";
import kitchenInventory from "../../modules/foodAndKitchen/inventory/inventory.model.js";
import storeRoomHistory from "../../modules/StoreRoomInventory/inventoryHistory.model.js";
import kitchenHistory from "../../modules/foodAndKitchen/inventory/kitchenHistory.model.js";
import cylinder from "../../modules/foodAndKitchen/cylinder/cylinder.model.js";
import advance from "../../modules/FinanceAndUtilities/advance/advance.model.js"; 
import dailyExpense from "../../modules/FinanceAndUtilities/dailyExpense/expense.model.js";
import dueTracker from "../../modules/FinanceAndUtilities/dueTracker/dueTracker.model.js";
import electricityBill from "../../modules/FinanceAndUtilities/ElectricityBill/ebill.model.js";
import incomingFund from "../../modules/FinanceAndUtilities/Fund/fund.model.js";
import payrool from "../../modules/FinanceAndUtilities/Payroll/payroll.model.js"; 
import roomRent from "../../modules/FinanceAndUtilities/RoomRent/roomRent.model.js";
import complaint from "../../modules/complaints/complaint.model.js";

export const moduleGroups = {
  Register: [register],
  Employees: [employee],
  Achievements: [achievements],
  UsersRoles: [user],
  StoreRoom: [storeRoomExpense, storeRoomInventory],
  KitchenInventory: [kitchenExpense, kitchenInventory, cylinder],
  FinanceUtilities: [
    advance, 
    dailyExpense, 
    dueTracker, 
    electricityBill, 
    incomingFund, 
    payrool, 
    roomRent
  ],
  Complaints: [complaint],
};

export const findHistory = (module, itemName, tenantId, branchName) => {
  if (module === "StoreRoom") return storeRoomHistory.findOne({ itemName, tenantId, branchName });
  if (module === "KitchenInventory") return kitchenHistory.findOne({ itemName, tenantId, branchName });
  return null;
};

export const findByIdInModels = async (models, filter) => {
  for (const Model of models) {
    const queryFilter = Model.modelName === "Cylinder" ? { _id: filter._id } : filter;
    const record = await Model.findOne(queryFilter);
    if (record) return { record, ModelUsed: Model };
  }
  return { record: null, ModelUsed: null };
};

export const deleteManyRecords = (Model, filter) => Model.deleteMany(filter);
export const getAllDeletedFromModels = (Model, filter) => Model.find(filter);