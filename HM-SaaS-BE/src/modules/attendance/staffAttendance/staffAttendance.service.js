import * as repo from "./staffAttendance.repository.js";
import staffAttendance from "./staffAttendance.model.js";

// ✅ Unified UTC date parser
const parseToUTCDate = (dateInput) => {
  if (!dateInput) return null;
  let normalized = dateInput;
  if (dateInput.includes("/")) {
    const [dd, mm, yyyy] = dateInput.split("/");
    normalized = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return new Date(normalized + "T00:00:00.000Z");
};

export const getAllStaffDataForAttendance = async (user, query, tenantId) => {
  const dateInput = query.date;
  if (!dateInput) {
    const err = new Error("Date is required");
    err.statusCode = 400;
    throw err;
  }

  const selectedDate = parseToUTCDate(dateInput);
  if (!selectedDate || isNaN(selectedDate)) {
    const err = new Error("Invalid date format");
    err.statusCode = 400;
    throw err;
  }

  const branchName =
    user.role === "Admin" || user.role === "Staff"
      ? query.branchName
      : user.branchName;
  if (!branchName) throw new Error("Branch name is required");

  const attendanceRecord = await repo.findAttendanceRecordByBranchAndDate(
    tenantId,
    branchName,
    selectedDate
  );

  // 🛠️ THE FIX: Return the raw saved attendance list directly!
  // Previously, this function was joining with the "Employee" db and throwing away kitchen staff.
  const result = attendanceRecord ? attendanceRecord.attendance.map(a => ({
    id: a.uid,
    userId: a.uid,
    staffName: a.staffName,
    role: a.role,
    shift: a.shift,
    present: a.present,
    attendance: a.present ? "present" : "absent"
  })) : [];

  return {
    message: "Employee attendance data fetched successfully",
    data: result,
  };
};

export const getSingleStaffStats = async (admin_id, branchName, empId) => {
  try {
    // Count every daily document where this branch, admin, and employee match "present: true"
    const presentDays = await staffAttendance.countDocuments({
      admin_id,
      branchName,
      attendance: { 
        $elemMatch: { uid: empId, present: true } 
      }
    });

    // Count every daily document where this branch, admin, and employee match "present: false"
    const absentDays = await staffAttendance.countDocuments({
      admin_id,
      branchName,
      attendance: { 
        $elemMatch: { uid: empId, present: false } 
      }
    });

    return { presentDays, absentDays };
    
  } catch (error) {
    console.error("Error calculating individual stats:", error);
    return { presentDays: 0, absentDays: 0 };
  }
};

export const updateStaffAttendance = async (user, body, tenantId) => {
  const { attendanceList, date, branchName } = body;

  if (!date) {
    const err = new Error("A valid date is required to save attendance.");
    err.statusCode = 400;
    throw err;
  }

  const selectedDate = parseToUTCDate(date);
  if (!selectedDate || isNaN(selectedDate)) {
    const err = new Error("Invalid date format");
    err.statusCode = 400;
    throw err;
  }

  if (!branchName) {
    const err = new Error("Branch name is required.");
    err.statusCode = 400;
    throw err;
  }

  let attendanceDoc = await repo.findAttendanceRecordByBranchAndDate(
    tenantId,
    branchName,
    selectedDate
  );

  if (!attendanceDoc) {
    attendanceDoc = repo.createAttendanceDoc({
      tenantId,
      admin_id: user._id,
      date: selectedDate,
      branchName,
      attendance: [],
    });
    await repo.saveAttendanceDoc(attendanceDoc);
  }

  const isAdmin = user.role === "Admin";
  const skipped = [];
  const updatedEntries = [];

  for (const entry of attendanceList) {
    const empId = entry.userId || entry.id || entry.empId;
    const present = entry.present;

    const emp = await repo.findEmployeeById(empId, tenantId);

    // 🛠️ THE FIX: Do NOT use "if (!emp) continue;". 
    // We now trust the frontend data for staff that aren't in the primary Employee DB!
    const staffName = emp?.Name || entry.staffName || "Staff";
    const role = emp?.Designation || entry.role || "Staff";
    const shift = emp?.Shift || entry.shift || "-";

    if (emp && emp.tenantId && String(emp.tenantId) !== String(tenantId)) {
      continue;
    }

    const index = attendanceDoc.attendance.findIndex(
      (a) => a.uid.toString() === String(empId)
    );
    const existing = index >= 0 ? attendanceDoc.attendance[index] : null;

    const staffObj = {
      uid: empId,
      staffName: staffName,
      role: role,
      shift: shift,
      present,
    };

    if (index >= 0) {
      if (isAdmin || !existing.present) {
        attendanceDoc.attendance[index] = staffObj;
        updatedEntries.push(staffObj);
      } else {
        skipped.push(empId);
      }
    } else {
      attendanceDoc.attendance.push(staffObj);
      updatedEntries.push(staffObj);
    }
  }

  await attendanceDoc.save();

  return {
    updatedEntries,
    skipped: skipped.length ? skipped : undefined,
  };
};