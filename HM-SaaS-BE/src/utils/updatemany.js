import mongoose from "mongoose";

import room from "../modules/roomAndResidents/Room&Residence.model.js";
import achievement from "../modules/achievement/achievement.model.js";
import certificate from "../modules/certificate/certificate.model.js";
import complaint from "../modules/complaints/complaint.model.js";
import dailyExpense from "../modules/FinanceAndUtilities/dailyExpense/expense.model.js";
import employee from "../modules/employee/employee.model.js";
import roomRent from "../modules/FinanceAndUtilities/RoomRent/roomRent.model.js";
import user from "../modules/User&Roles/userRoles.model.js";

import storeRoomExpense from "../modules/StoreRoomExpenses/item.model.js";
import storeRoomInventory from "../modules/StoreRoomInventory/inventory.model.js";

import kitchenExpense from "../modules/foodAndKitchen/expenses/expenses.model.js";
import kitchenInventory from "../modules/foodAndKitchen/inventory/inventory.model.js";

export const fixDeletedFields = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // List of collections to update
    const collections = [
      { model: user, module: "user" },
      { model: room, module: "room" },
      { model: achievement, module: "achievement" },
      { model: certificate, module: "certificate" },
      { model: complaint, module: "complaint" },
      { model: dailyExpense, module: "dailyExpense" },
      { model: employee, module: "employee" },
      { model: roomRent, module: "roomRent" },

      // 🔥 Added 4 missing modules
      { model: storeRoomExpense, module: "storeRoomExpense" },
      { model: storeRoomInventory, module: "storeRoomInventory" },
      { model: kitchenExpense, module: "kitchenExpense" },
      { model: kitchenInventory, module: "kitchenInventory" },
    ];

    // Loop through each collection and fix missing fields
    for (const { model, module } of collections) {
      const result = await model.updateMany(
        { isdeleted: { $exists: false } },
        {
          $set: {
            isdeleted: false,
            deletedinfo: {
              deleteddate: null,
              deleteby: null,
              module: module,
            },
          },
        },
      );

      console.log(`✅ ${module}: Updated ${result.modifiedCount} documents.`);
    }

    await mongoose.connection.close();
    console.log("🔒 MongoDB connection closed.");
  } catch (error) {
    console.error("❌ Error updating documents:", error);
  }
};

// fixDeletedFields();
