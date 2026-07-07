import staffAttendance from "./staffAttendance.model.js";
import employee from "../../employee/employee.model.js";

// ✅ Find attendance by branch/date/admin using a date range
// This fixes the core "data lost on refresh" bug:
// MongoDB stores dates as ISODate objects. Querying with a plain string like "2025-01-15"
// does NOT match ISODate("2025-01-15T00:00:00.000Z"). Using $gte/$lte with UTC midnight
// boundaries guarantees a reliable match regardless of how the date was stored.
export const findAttendanceRecordByBranchAndDate = (
  tenantId,
  branchName,
  date // expects a UTC midnight Date object from service
) => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  return staffAttendance.findOne({
    tenantId,
    branchName,
    date: { $gte: start, $lte: end },
  });
};

// Create attendance document (does NOT save — caller must save)
export const createAttendanceDoc = (data) => {
  return new staffAttendance(data);
};

// Save document
export const saveAttendanceDoc = (doc) => {
  return doc.save();
};

// Get employees by branch
export const findEmployeesByBranch = (tenantId, branchName) => {
  return employee
    .find({
      tenantId,
      branchName,
      isdeleted: false,
    })
    .sort({ DOJ: 1 });
};

// Find employee by ID
export const findEmployeeById = (id, tenantId) => {
  return employee.findOne({ _id: id, tenantId });
};