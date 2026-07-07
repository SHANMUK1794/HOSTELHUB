import * as repo from "./residentsAttendance.repository.js";
import { sortRooms } from "../../../utils/roomsorter.js";
import Attendance from "./residentsAttendance.model.js";

const parseDateUTC = (rawDate) => {
  const d = rawDate ? new Date(rawDate) : new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
};

export const getAllRoomDataWithUsers = async (user, body, query, tenantId) => {
  const branchName =
    user.role === "Admin" || user.role === "Staff"
      ? query.branchName || body.branchName
      : user.branchName;

  const rawDate = body.date || query.date;
  if (!rawDate) throw new Error("Date is required");

  const startOfDay = parseDateUTC(rawDate);
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCHours(23, 59, 59, 999);

  let rooms = await repo.findRoomsByBranch(branchName, tenantId);
  rooms = sortRooms(rooms);

  const attendanceRecord = await repo.findAttendanceRecordByBranchAndDate(
    branchName,
    startOfDay,
    endOfDay,
    tenantId
  );

  const result = [];
  for (const roomData of rooms) {
    let usersInRoom = await repo.findUsersInRoom({
      RoomNo: roomData.RoomNo,
      branchName,
      tenantId,
      staying: true,
      $and: [
        { DateOfJoining: { $lte: endOfDay } },
        {
          $or: [
            { vacatedate: { $exists: false } },
            { vacatedate: null },
            { vacatedate: { $gte: startOfDay } },
          ],
        },
      ],
    });

    usersInRoom.sort((a, b) => new Date(a.DateOfJoining) - new Date(b.DateOfJoining));

    if (usersInRoom.length > 0) {
      const Name = usersInRoom.map((u) => {
        let status = null;
        if (attendanceRecord?.attendanceList) {
          const found = attendanceRecord.attendanceList.find(
            (a) => a.userId.toString() === u._id.toString(),
          );
          if (found) status = found.status;
        }
        return { id: u._id, name: u.Name, foodType: u.FoodType, status };
      });

      result.push({
        branch: branchName,
        roomNo: roomData.RoomNo,
        noOfMembers: usersInRoom.length,
        Name,
      });
    }
  }

  const summary = await repo.findTodaySummary(branchName, startOfDay, endOfDay, tenantId);

  return {
    message: "Room data fetched successfully",
    Status: {
      totalPresent: summary ? summary.totalPresent : 0,
      totalAbsent: summary ? summary.totalAbsent : 0,
      totalCount: summary ? summary.totalCount : 0,
    },
    data: result,
  };
};

export const markAttendanceAndGetSummary = async (user, body, tenantId) => {
  const { attendanceList, date } = body;
  const branchName =
    user.role === "Admin" || user.role === "Staff"
      ? body.branchName
      : user.branchName;

  const startOfDay = parseDateUTC(date);
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCHours(23, 59, 59, 999);

  let attendanceDoc = await repo.findAttendanceRecordByBranchAndDate(
    branchName,
    startOfDay,
    endOfDay,
    tenantId
  );

  if (!attendanceDoc) {
    attendanceDoc = new Attendance({
      date: startOfDay,
      branchName,
      attendanceList: [],
      tenantId,
    });
  }

  // 🛠️ FIX 1: Wipe the array before repopulating to remove ghost users
  attendanceDoc.attendanceList = [];

  for (const entry of attendanceList) {
    const userDoc = await repo.findUserById(entry.userId || entry.id, tenantId);
    if (!userDoc) continue;

    attendanceDoc.attendanceList.push({
      userId: userDoc._id,
      userName: userDoc.Name,
      foodType: userDoc.FoodType,
      status: entry.status,
      roomNo: userDoc.RoomNo,
    });
  }

  await repo.saveAttendanceDoc(attendanceDoc);

  // 🛠️ FIX 2: Stop querying the database for random users!
  // Use the exact length of the documented list to perfectly match the frontend table
  const totalCount = attendanceDoc.attendanceList.length;
  const totalPresent = attendanceDoc.attendanceList.filter((u) => u.status === true).length;
  
  const summaryPayload = {
    totalPresent,
    totalAbsent: Math.max(0, totalCount - totalPresent),
    totalVeg: attendanceDoc.attendanceList.filter((u) => u.status === true && u.foodType === "Veg").length,
    totalNonVeg: attendanceDoc.attendanceList.filter((u) => u.status === true && u.foodType === "Non-Veg").length,
    totalCount, // Now this will perfectly match your frontend table!
  };

  const updatedSummary = await repo.upsertSummary(branchName, startOfDay, summaryPayload, tenantId);

  return { attendanceId: attendanceDoc._id, data: [updatedSummary] };
};