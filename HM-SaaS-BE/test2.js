import * as dotenv from 'dotenv';
dotenv.config();
import { connectDb } from './src/config/dbConfig.js';
import Register from './src/modules/register/register.model.js';

async function test() {
  await connectDb();
  const allStudents = await Register.find({ staying: true, isdeleted: false });
  const allUsers = normalizeUsers(allStudents, []);
  const weekListAll = upcomingBirthdays(allUsers);
  console.log('Upcoming:', weekListAll);
  process.exit(0);
}
test();
