import { sortRooms } from "../../../utils/roomsorter.js";
import * as repo from "./attendanceCount.repository.js";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const employeeCount = async (user, query, body) => {
  const { year, month } = query;
  const branchName =
    user.role === "Admin" || user.role === "Staff"
      ? query.branchName || body.branchName
      : user.branchName;

  const start = new Date(
    year,
    monthNames.findIndex((m) => m.toLowerCase() === month.toLowerCase()),
    1,
  );
  const end = new Date(
    year,
    monthNames.findIndex((m) => m.toLowerCase() === month.toLowerCase()) + 1,
    0,
  );

  const employeeMap = new Map();
  const docs = await repo.findStaffAttendanceDocs(branchName, start, end);

  for (const doc of docs) {
    const iso = doc.date.toISOString().split("T")[0];
    for (const emp of doc.attendance) {
      const uid = emp.uid.toString();
      if (!employeeMap.has(uid)) {
        employeeMap.set(uid, {
          uid,
          name: emp.staffName,
          present: 0,
          absent: 0,
          absentDates: [],
        });
      }
      const data = employeeMap.get(uid);
      if (emp.present) data.present += 1;
      else {
        data.absent += 1;
        data.absentDates.push(iso);
      }
    }
  }

  return {
    message: `Employee attendance summary for ${branchName} - ${month} ${year}`,
    branchName,
    year: parseInt(year),
    month,
    employees: Array.from(employeeMap.values()),
  };
};

export const usercount = async (user, query, body) => {
  const { year, month } = query;
  const branchName =
    user.role === "Admin" || user.role === "Staff"
      ? query.branchName || body.branchName
      : user.branchName;

  const start = new Date(
    year,
    monthNames.findIndex((m) => m.toLowerCase() === month.toLowerCase()),
    1,
  );
  const end = new Date(
    year,
    monthNames.findIndex((m) => m.toLowerCase() === month.toLowerCase()) + 1,
    0,
  );

  const userMap = new Map();
  const docs = await repo.findAttendanceDocs(branchName, start, end);

  for (const doc of docs) {
    const iso = doc.date.toISOString().split("T")[0];
    for (const item of doc.attendanceList) {
      const uid = item.userId.toString();
      if (!userMap.has(uid)) {
        userMap.set(uid, {
          userId: item.userId,
          name: item.userName,
          roomNo: item.roomNo || "N/A",
          present: 0,
          absent: 0,
          absentDates: [],
        });
      }
      const data = userMap.get(uid);
      if (item.status === true) data.present += 1;
      else if (item.status === false) {
        data.absent += 1;
        data.absentDates.push(iso);
      }
    }
  }

  const usersArr = Array.from(userMap.values());
  const sortedUsers = sortRooms(
    usersArr.map((u) => ({ ...u, RoomNo: u.roomNo })),
  );

  return {
    message: `User attendance summary for ${branchName} - ${month} ${year}`,
    branchName,
    year: parseInt(year),
    month,
    users: sortedUsers,
  };
};