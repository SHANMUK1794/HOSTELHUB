import * as dotenv from 'dotenv';
dotenv.config();
import { connectDb } from './src/config/dbConfig.js';
import Register from './src/modules/register/register.model.js';
import { upcomingBirthdays, normalizeUsers } from './src/modules/reminder/reminder.service.js';

async function test() {
  await connectDb();
  const allStudents = await Register.find({ staying: true, isdeleted: false });
  const allUsers = normalizeUsers(allStudents, []);
  const weekListAll = upcomingBirthdays(allUsers);
  console.log('Upcoming length:', weekListAll.length);
  console.log(weekListAll.map(u => u.Name + ' ' + u.DateOfBirth + ' ' + u.inDays));
  process.exit(0);
}
test();
