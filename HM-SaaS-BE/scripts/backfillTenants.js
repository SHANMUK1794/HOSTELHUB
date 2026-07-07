import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDb } from "../src/config/dbConfig.js";

// Load models
import register from "../src/modules/register/register.model.js";
import employee from "../src/modules/employee/employee.model.js";
import userRoles from "../src/modules/User&Roles/userRoles.model.js";
import achievements from "../src/modules/achievement/achievement.model.js";
import pgdata from "../src/modules/pgdata/pgdata.model.js";
import Tenant from "../src/modules/tenant/tenant.model.js";
// (You can import other models as needed, or dynamically backfill)

dotenv.config();

const backfill = async () => {
  try {
    await connectDb();
    console.log("Connected to MongoDB");

    // 1. Check if a default tenant exists
    let defaultTenant = await Tenant.findOne({ name: "Default Legacy Organization" });
    if (!defaultTenant) {
      console.log("Creating default legacy organization...");
      defaultTenant = await Tenant.create({
        name: "Default Legacy Organization",
        description: "Auto-generated tenant for legacy data",
        owner: new mongoose.Types.ObjectId(), // Create a dummy owner ID for legacy data
        branches: ["Main Branch"], // Provide a default branch to pass validation
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("Created Default Tenant with ID:", defaultTenant._id);
    } else {
      console.log("Default Tenant found:", defaultTenant._id);
    }

    const tenantId = defaultTenant._id;

    // 2. Backfill all models
    const modelsToUpdate = [
      { name: "Users", model: userRoles },
      { name: "Registers", model: register },
      { name: "Employees", model: employee },
      { name: "Achievements", model: achievements },
      { name: "PGData", model: pgdata },
    ];

    for (const { name, model } of modelsToUpdate) {
      console.log(`Updating ${name}...`);
      const result = await model.updateMany(
        { tenantId: { $exists: false } },
        { $set: { tenantId: tenantId } }
      );
      console.log(`✅ ${name}: Modified ${result.modifiedCount} documents.`);
    }

    console.log("🎉 Backfill completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Backfill failed:", error);
    process.exit(1);
  }
};

backfill();
