import * as dotenv from 'dotenv';
dotenv.config();
import { connectDb } from './src/config/dbConfig.js';
import dashboardService from './src/modules/dashboard/dashboard.service.js';
import mongoose from 'mongoose';

async function test() {
  await connectDb();
  
  // Use user tenantId that we know
  const tenantId = new mongoose.Types.ObjectId('6a24140ee6b0599f72002c92');
  const data = await dashboardService.getDashboardData('First Branch', new Date(), tenantId);
  console.log('Dynamic graphs returned:');
  console.log(Object.keys(data.dynamicGraphs || {}));
  process.exit(0);
}
test();
