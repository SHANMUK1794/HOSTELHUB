import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { connectDb } from './src/config/dbConfig.js';
import * as expenseService from './src/modules/FinanceAndUtilities/dailyExpense/expense.service.js';

async function test() {
  await connectDb();
  
  // Pick any tenant and user
  const db = mongoose.connection.db;
  const adminUser = await db.collection('users').findOne({ role: 'Admin' });
  if (!adminUser) {
    console.log("No admin found");
    process.exit(0);
  }
  
  const tenantId = adminUser.tenantId;
  
  console.log("Testing getExpenseOverviewGraphData...");
  try {
    const data = await expenseService.getExpenseOverviewGraphData(tenantId, null, 2025, adminUser);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
test();
