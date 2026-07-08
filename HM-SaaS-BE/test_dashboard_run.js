import * as dotenv from "dotenv";
dotenv.config();
import { connectDb } from "./src/config/dbConfig.js";
import dashboardService from "./src/modules/dashboard/dashboard.service.js";
import prisma from "./src/config/prisma.js";

async function test() {
  try {
    await connectDb();
    console.log("Connected to DB");
    
    // Find or create a test tenant and user
    let user = await prisma.user.findFirst();
    if (!user) {
      console.log("No user found. Creating a test admin user...");
      user = await prisma.user.create({
        data: {
          username: "test_admin",
          email: "test_admin@test.com",
          password: "hashed_password_placeholder",
          role: "Admin",
          tenantId: "test-tenant-id-123",
          staffName: "Test Admin",
          branchName: "Common"
        }
      });
    }

    console.log("Running getDashboardData for tenantId:", user.tenantId);
    const data = await dashboardService.getDashboardData(user.branchName, new Date(), user.tenantId);
    console.log("✅ Dashboard data loaded successfully:", Object.keys(data));
  } catch (err) {
    console.error("❌ Test failed:", err);
  } finally {
    process.exit(0);
  }
}

test();
