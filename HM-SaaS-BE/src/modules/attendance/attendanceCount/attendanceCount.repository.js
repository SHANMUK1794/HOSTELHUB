// import Attendance from "../residentsAttendance/residents.model.js";
// import StaffAttendance from "../staffAttendance/staffAttendance.model.js";

// export const getUserAttendance = (branchName, start, end) =>
//   Attendance.find({ branchName, date: { $gte: start, $lte: end } });

// export const getStaffAttendance = (branchName, start, end) =>
//   StaffAttendance.find({ branchName, date: { $gte: start, $lte: end } });

import staffAttendance from "../staffAttendance/staffAttendance.model.js";
import attendance from "../residentsAttendance/residentsAttendance.model.js";


export const findStaffAttendanceDocs = (branchName, start, end) => {
  return staffAttendance.find({
    branchName,
    date: { $gte: start, $lte: end },
  });
};

export const findAttendanceDocs = (branchName, start, end) => {
  return attendance.find({
    branchName,
    date: { $gte: start, $lte: end },
  });
};