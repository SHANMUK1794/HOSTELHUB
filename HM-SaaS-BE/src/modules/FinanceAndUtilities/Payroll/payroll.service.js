import * as payrollRepo from "./payroll.repository.js";
import employees from "../../employee/employee.model.js";
import advances from "../advance/advance.model.js";
import duetrackers from "../dueTracker/dueTracker.model.js";
import staffAttendance from "../../attendance/staffAttendance/staffAttendance.model.js";
import { sendPayrollMessage } from "../../../utils/whatsapp.js";
import { buildCombinedFilter } from "../../../utils/filter.js";
import ExcelJS from "exceljs";
import { getConfig } from "../../../utils/businessConfig.js";

const parseDate = (input) => {
  if (input.includes("/")) {
    const [dd, mm, yyyy] = input.split("/");
    return new Date(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`);
  }
  return new Date(input);
};

export const addPayroll = async (body, tenantId) => {
  const {
    employeeId,
    date,
    mobile,
    month,
    salary,
    advance,
    deduction,
    status,
    staff_name,
    branchName,
    paymentmethod,
    total,
    leave,
  } = body;

  // Validation
  if (
    !staff_name?.trim() ||
    !date?.trim() ||
    salary == null ||
    !status?.trim() ||
    !branchName?.trim()
  ) {
    throw new Error("Please fill all fields");
  }

  const parsedDate = parseDate(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsedDate > today) throw new Error("Future dates are not allowed");

  // Duplicate Check
  const existing = await payrollRepo.findOne({
    mobile: Number(mobile),
    month: month.trim(),
    tenantId,
  });
  if (existing)
    throw new Error(
      `Payroll for this mobile (${mobile}) already exists in ${month}.`,
    );

  const employee = await employees.findOne({ _id: employeeId, tenantId });
  if (!employee) throw new Error("Employee not found");

  const result = await payrollRepo.create({
    ...body,
    date: parsedDate,
    DOJ: employee.DOJ,
    tenantId,
  });

  // Deduction Logic
  if (Number(deduction) > 0) {
  let advanceRecord = await advances.findOne({
    employee_id: employeeId,
    tenantId,
  });

  if (!advanceRecord) {
    throw new Error("No advance record found for this employee");
  }

  if (Number(deduction) > advanceRecord.balance) {
    throw new Error(
      `Payment amount ₹${deduction} exceeds balance ₹${advanceRecord.balance}`
    );
  }

  advanceRecord.paid += Number(deduction);
  advanceRecord.balance =
    advanceRecord.balance - Number(deduction);

  if (advanceRecord.balance === 0) {
    advanceRecord.status = "Paid";
  }

  await advanceRecord.save();


    await duetrackers.create({
      employee_id: employeeId,
      total_amount: 0,
      paid_amount: Number(deduction),
      balance: advanceRecord.balance,
      status: "paid",
      payment_method: paymentmethod,
      date: parsedDate,
      tenantId,
    });

    employee.Advance = Math.max(0, (employee.Advance || 0) - Number(deduction));
    await employee.save();
  }

  // WhatsApp
  if (status?.trim().toLowerCase() === "paid") {
    const tenantSettings = await getConfig(tenantId); // 👉 Fetch config
    sendPayrollMessage(
      mobile,
      staff_name,
      month,
      salary,
      advance,
      deduction,
      leave,
      total,
      tenantSettings
    ).catch((err) => console.warn(err.message));
  }

  return result;
};

export const calculateAttendance = async (body, tenantId) => {
  let { phoneNumber, month, year } = body;
  const currentDate = new Date();
  if (!month) month = currentDate.getMonth() + 1;
  if (!year) year = currentDate.getFullYear();

  const employee = await employees
    .findOne({ Mobile: phoneNumber, tenantId })
    .select("-DOJ -DOB -Age");
  if (!employee) throw new Error("Employee not found");

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  const attendanceRecords = await staffAttendance.find({
    date: { $gte: startOfMonth, $lte: endOfMonth },
    tenantId,
    "attendance.uid": employee._id,
  });

  let leaveCount = 0,
    workingdays = 0;
  attendanceRecords.forEach((record) => {
    const entry = record.attendance.find(
      (a) => a.uid.toString() === employee._id.toString(),
    );
    if (entry) entry.present ? workingdays++ : leaveCount++;
  });


  //Test Data
  // const workingdays = 27; // simulate
  // const leaveCount = 30 - workingdays;

  // const perDay = employee.PerDay || 0;
  // let bonus = 0,
  //   cl = 0,
  //   leave = 0,
  //   leavewages = 0;

  // if (leaveCount === 0) bonus = perDay * 2;
  // else if (leaveCount === 1) {
  //   bonus = perDay;
  //   cl = 1;
  // } else if (leaveCount === 2) cl = 2;
  // else {
  //   cl = 2;
  //   leave = leaveCount - 2;
  //   leavewages = leave * perDay;
  // }


  const config = await getConfig(tenantId);
  const perDay = employee.Salary / config.workingDaysPerMonth;
  const leave = leaveCount;
  const leavewages = leaveCount * perDay;

 const advanceRecord = await advances.findOne({
  employee_id: employee._id,
  tenantId
});

// console.log("Working Days:", workingdays);
// console.log("Leave Count:", leaveCount);
// console.log("Per Day Salary:", perDay);
// console.log("Leave Wages:", leavewages);
// console.log("Total Salary:", (employee.Salary || 0) - leavewages);

return {
  employee,
  advance: advanceRecord?.advance || 0,
  balance: advanceRecord?.balance || 0,
  bonus: 0,
  leave,
  leavewages,
  cl: 0,
  workingdays,
  totalSalary: (employee.Salary || 0) - leavewages,
};
};

export const updatePayroll = async (id, updateData, tenantId) => {
  const existing = await payrollRepo.findById({ _id: id, tenantId });
  if (!existing) throw new Error("Payroll not found");

  if (updateData.date && new Date(updateData.date) > new Date())
    throw new Error("Future dates not allowed");
  if (updateData.mobile == 0) updateData.mobile = existing.mobile;

  const updated = await payrollRepo.findByIdAndUpdate({ _id: id, tenantId }, updateData);

  if (
    existing.status.toLowerCase() !== "paid" &&
    updated.status.toLowerCase() === "paid"
  ) {
    const tenantSettings = await getConfig(tenantId); // 👉 Fetch config
    sendPayrollMessage(
      updated.mobile,
      updated.staff_name,
      updated.month,
      updated.salary,
      updated.advance,
      updated.deduction,
      updated.leave,
      updated.total,
      tenantSettings
    ).catch((err) => console.warn(err.message));
  }
  return updated;
};

export const getAllPayrolls = async (user, query, tenantId) => {
  const filter = buildCombinedFilter(user, query);
  
  // 👉 FIXED: Isolate live payrolls from elements inside the Recycle Bin
  filter.isdeleted = { $ne: true };
  filter.tenantId = tenantId;

  const result = await payrollRepo.find(filter);

for (let row of result) {
  if (!row.DOJ && row.employeeId) {
    const emp = await employees
      .findOne({ _id: row.employeeId, tenantId })
      .lean();

    row.DOJ = emp?.DOJ || null;
  }

  // Fetch latest advance record
  const latestAdvance = await advances.findOne({
    employee_id: row.employeeId,
    tenantId,
    isdeleted: { $ne: true },
  });

  
  if (latestAdvance) {
    row.advance = latestAdvance.advance || 0;
    row.balance = latestAdvance.balance || 0;
  }
}

return result;
};

export const exportExcel = async (user, query, tenantId) => {
  const filter = buildCombinedFilter(user, query);
  
  // 👉 FIXED: Avoid exporting soft-deleted lines to reporting output sheets
  filter.isdeleted = { $ne: true };
  filter.tenantId = tenantId;

  const payrolls = await payrollRepo.find(filter);
  if (!payrolls.length) throw new Error("No payroll data found");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Payroll Export");
  sheet.addRow(["S_No", "Name", "Total", "Mobile", "Branch"]);
  sheet.getRow(1).font = { bold: true };

  payrolls.forEach((row, index) => {
    sheet.addRow([
      index + 1,
      row.staff_name,
      Number(row.total || 0),
      row.mobile,
      row.branchName,
    ]);
  });

  sheet.columns = [
    { width: 8 },
    { width: 25 },
    { width: 15 },
    { width: 18 },
    { width: 25 },
  ];
  return await workbook.xlsx.writeBuffer();
};
// export const getAllPayrolls = async (user, query) => {
//   const filter = buildCombinedFilter(user, query);
//   const result = await payrollRepo.find(filter);

//   for (let row of result) {
//     if (!row.DOJ && row.employeeId) {
//       const emp = await employees.findById(row.employeeId).lean();
//       row.DOJ = emp?.DOJ || null;
//     }
//   }
//   return result;
// };

// export const exportExcel = async (user, query) => {
//   const filter = buildCombinedFilter(user, query);
//   const payrolls = await payrollRepo.find(filter);
//   if (!payrolls.length) throw new Error("No payroll data found");

//   const workbook = new ExcelJS.Workbook();
//   const sheet = workbook.addWorksheet("Payroll Export");
//   sheet.addRow(["S_No", "Name", "Total", "Mobile", "Branch"]);
//   sheet.getRow(1).font = { bold: true };

//   payrolls.forEach((row, index) => {
//     sheet.addRow([
//       index + 1,
//       row.staff_name,
//       Number(row.total || 0),
//       row.mobile,
//       row.branchName,
//     ]);
//   });

//   sheet.columns = [
//     { width: 8 },
//     { width: 25 },
//     { width: 15 },
//     { width: 18 },
//     { width: 25 },
//   ];
//   return await workbook.xlsx.writeBuffer();
// };
