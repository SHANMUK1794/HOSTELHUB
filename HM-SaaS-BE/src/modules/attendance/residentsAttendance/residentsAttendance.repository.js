import room from "../../roomAndResidents/Room&Residence.model.js";
import register from "../../register/register.model.js";
import attendance from "./residentsAttendance.model.js";
import summary from "../../foodAndKitchen/kitchenSummary/summary.model.js";

export const findRoomsByBranch = (branchName, tenantId) =>
  room.find({ branchName, tenantId }).select("-Floor");

export const findAttendanceRecordByBranchAndDate = (branchName, start, end, tenantId) =>
  attendance.findOne({ branchName, date: { $gte: start, $lte: end }, tenantId });

export const findUsersInRoom = (query) => register.find(query);

export const findUserById = (id, tenantId) => register.findOne({ _id: id, tenantId });

// 🛠️ THE FIX: Added exact date filtering so vacated inmates are NOT counted as absent!
export const countStayingUsers = (branchName, startOfDay, endOfDay, tenantId) => {
  if (startOfDay && endOfDay) {
    return register.countDocuments({
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
  }
  return register.countDocuments({ branchName, staying: true, tenantId });
};

export const saveAttendanceDoc = (doc) => doc.save();

export const upsertSummary = (branchName, date, payload, tenantId) =>
  summary.findOneAndUpdate(
    { branchName, date, tenantId },
    { $set: { ...payload, date, tenantId } },
    { upsert: true, new: true },
  );

export const findTodaySummary = (branchName, start, end, tenantId) =>
  summary.findOne({ branchName, date: { $gte: start, $lte: end }, tenantId });