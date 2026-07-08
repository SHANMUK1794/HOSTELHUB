import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDb } from "./src/config/dbConfig.js";
import prisma from "./src/config/prisma.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import settingsRouter from "./src/modules/settings/settings.routes.js";

dotenv.config();
import inventoryRoutes from "./src/modules/foodAndKitchen/inventory/inventory.routes.js";
import expensesRoutes from "./src/modules/foodAndKitchen/expenses/expenses.routes.js";
import subscriptionRoutes from "./src/modules/subscription/subscription.routes.js";
import { EventEmitter } from "events";
EventEmitter.defaultMaxListeners = 20;
import certificateRoutes from "./src/modules/certificate/certificate.route.js";
import complaintRoutes from "./src/modules/complaints/complaint.routes.js";
import payrollRoutes from "./src/modules/FinanceAndUtilities/Payroll/payroll.routes.js";
import userRoutes from "./src/modules/userController/auth.routes.js";
import dailyExpenseRoutes from "./src/modules/FinanceAndUtilities/dailyExpense/expense.routes.js";
import roomRouter from "./src/modules/roomAndResidents/Room&Residence.routes.js";
import registerroute from "./src/modules/register/register.routes.js";
import foodMenuRouter from "./src/modules/foodAndKitchen/menu/menu.routes.js";
import attendanceRouter from "./src/modules/attendance/residentsAttendance/residentsAttendance.routes.js";
import employeeRouter from "./src/modules/employee/employee.routes.js";
import remainderRouter from "./src/modules/reminder/reminder.routes.js";
import electricityBillRouter from "./src/modules/FinanceAndUtilities/ElectricityBill/ebill.routes.js";
import achievementRoutes from "./src/modules/achievement/achievement.routes.js";
import dashRouter from "./src/modules/dashboard/dashboard.routes.js";
import roomrentRouter from "./src/modules/FinanceAndUtilities/RoomRent/roomRent.routes.js";
import notification from "./src/modules/notification/notification.routes.js";
import { startCronJobs } from "./src/utils/scheduler.js";

import employee from "./src/modules/User&Roles/userRoles.routes.js";

import advancerouter from "./src/modules/FinanceAndUtilities/advance/advance.routes.js";
import pgdata from "./src/modules/pgdata/pgdata.routes.js";
import staffAttendancerouter from "./src/modules/attendance/staffAttendance/staffAttendance.routes.js";
import path from "path";
import storeRoomInventoryRoutes from "./src/modules/StoreRoomInventory/inventory.routes.js";
import storeRoomExpenseRoutes from "./src/modules/StoreRoomExpenses/item.routes.js";

import cylinder from "./src/modules/foodAndKitchen/cylinder/cylinder.routes.js";
import vacationForm from "./src/modules/vacationForm/vacationform.routes.js";
import deletes from "./src/modules/delete/delete.routes.js";
import fund from "./src/modules/FinanceAndUtilities/Fund/fund.routes.js";
import tenantRoutes from "./src/modules/tenant/tenant.routes.js";

import localToLiveRoutes from "./src/routes/localtolive.js";
import bulkregist from "./src/routes/bulkregist.js";

import { fileURLToPath } from "url";
// Required to get the current directory in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 5000;
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
].filter(Boolean);

const isAllowedCloudflarePagesOrigin = (origin) => {
  try {
    const { hostname } = new URL(origin);
    return hostname === "hostelhub.pages.dev" || hostname.endsWith(".hostelhub.pages.dev");
  } catch {
    return false;
  }
};

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));




app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || isAllowedCloudflarePagesOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.set("trust proxy", 1);

const loginLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again after an hour",
});
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ok", database: "ok" });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "unreachable",
      message: error.message,
    });
  }
});
app.use("/api/users/v1/login", loginLimiter);


// 👉 ADD THIS EXACT LINE TO MAKE IMAGES PUBLIC:
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.json());
// ... (Keep the rest of your app.use() and routes exactly the same)

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, 'public/uploads')));

app.use("/api/users/v1", userRoutes);
app.use("/api/achievements/v1", achievementRoutes);
app.use("/api/inventory/v1", inventoryRoutes);
app.use("/api/expenses/v1", expensesRoutes);
app.use("/api/employee/v1", employee);
app.use("/api/rooms/v1", roomRouter);
app.use("/api/register/v1", registerroute);
app.use("/api/kitchen/v1", foodMenuRouter);
app.use("/api/attendance/v1", attendanceRouter);
app.use("/api/birthday/v1", remainderRouter);
app.use("/api/electricity/v1", electricityBillRouter);
app.use("/api/v1/certificate", certificateRoutes);
app.use("/api/v1/complaint", complaintRoutes);
app.use("/api/v1/payroll", payrollRoutes);
app.use("/api/v1/daily_expense", dailyExpenseRoutes);
app.use("/api/v1/dashboard", dashRouter);
app.use("/api/payement/v1", roomrentRouter);
app.use("/api/staffAttendance/v1", staffAttendancerouter);
app.use("/api/v1/notify", notification);
app.use("/uploads", express.static(path.join(__dirname, 'public/uploads')));
app.use("/api/v1/bulkregist", bulkregist);
app.use("/api/workers/v1", employeeRouter);
app.use("/api/advance/v1", advancerouter);
app.use("/api/v1/store_room_expense", storeRoomExpenseRoutes);
app.use("/api/v1/store_room_inventory", storeRoomInventoryRoutes);
app.use("/api/pgdata/v1", pgdata);
app.use("/api/cylinder/v1", cylinder);
app.use("/api/local/v1", localToLiveRoutes);
app.use("/api/vacationform/v1", vacationForm);
app.use("/api/deletes/v1", deletes);
app.use("/api/funds/v1", fund);
app.use("/api/tenant/v1", tenantRoutes);
app.use("/api/settings/v1", settingsRouter);
app.use("/api/subscription/v1", subscriptionRoutes);

async function startServer() {
  try {
    await connectDb();
    // 👉 START THE CRON ENGINE HERE
    startCronJobs();
    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error);
  }
}

startServer();
