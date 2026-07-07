import * as dotenv from 'dotenv';
dotenv.config();
import { connectDb } from './src/config/dbConfig.js';
import Register from './src/modules/register/register.model.js';
import { upcomingBirthdays, normalizeUsers } from './src/modules/reminder/reminder.service.js';

async function test() {
  await connectDb();
  
  const branches = ['IOB Mens Hostel', 'First Branch'];
  for (const branch of branches) {
    const students = await Register.find({ branchName: branch, staying: true, isdeleted: false });
    const users = normalizeUsers(students, []);
    const weekList = upcomingBirthdays(users);
    console.log(`Upcoming for ${branch}:`, weekList.length);
  }
  process.exit(0);
}
test();
