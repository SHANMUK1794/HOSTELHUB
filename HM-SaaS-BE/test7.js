import * as dotenv from 'dotenv';
dotenv.config();
import { connectDb } from './src/config/dbConfig.js';
import dashboardService from './src/modules/dashboard/dashboard.service.js';
import mongoose from 'mongoose';

async function test() {
  await connectDb();
  
  const tenantId = new mongoose.Types.ObjectId('6a24140ee6b0599f72002c92'); // Need an actual tenantId, wait I don't have one right now. Let me just console log it in the app.
  process.exit(0);
}
test();
