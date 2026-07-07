import AdvanceRepository from "./advance.repository.js";
import employees from "../../employee/employee.model.js";
import duetrackers from "../dueTracker/dueTracker.model.js";
import ExcelJS from "exceljs";

class AdvanceService {
  async createAdvance(data, tenantId) {
    const { phonenumber, amount, payment_method, date, branchName } = data;

    const employee = await employees.findOne({ Mobile: phonenumber, tenantId });
    if (!employee) throw new Error("Employee not found");

    let existingAdvance = await AdvanceRepository.findByEmployeeId(
      employee._id,
      tenantId
    );

    if (existingAdvance) {
      existingAdvance.advance =
        (existingAdvance.advance || 0) + parseFloat(amount);
      existingAdvance.balance =
        (existingAdvance.balance || 0) + parseFloat(amount);
      existingAdvance.status = "Pending";
      existingAdvance.isdeleted = false; // Reset if re-added
      await existingAdvance.save();
    } else {
      existingAdvance = await AdvanceRepository.create({
        employee_id: employee._id,
        staff_name: employee.staff_name || employee.Name,
        salary: employee.Salary || 0,
        mobile: employee.Mobile,
        advance: parseFloat(amount),
        paid: 0,
        branchName,
        balance: parseFloat(amount),
        tenantId,
      });
    }

    const dueTracker = new duetrackers({
      employee_id: employee._id,
      total_amount: parseFloat(amount),
      paid_amount: 0,
      balance: parseFloat(amount),
      status: "borrowed",
      payment_method,
      date: date ? new Date(date) : new Date(),
      tenantId,
    });
    await dueTracker.save();

    employee.Advance = (employee.Advance || 0) + parseFloat(amount);
    await employee.save();

    return { employee, existingAdvance, dueTracker };
  }

  async updateAdvance(advanceId, updateData, tenantId) {
    const { newAmount, status, payment_method, remarks } = updateData;

    const advance = await AdvanceRepository.findById({ _id: advanceId, tenantId });
    if (!advance) throw new Error("Advance record not found");

    const employee = await employees.findOne({ _id: advance.employee_id, tenantId });
    if (!employee) throw new Error("Employee not found");

    const oldAmount = advance.advance;
    const diff = newAmount - oldAmount;

    advance.advance = newAmount;
    advance.balance = advance.balance + diff;
    if (remarks) advance.remarks = remarks;
    await advance.save();

    const dueTracker = await duetrackers
      .findOne({ employee_id: employee._id, tenantId })
      .sort({ date: -1 });

    if (!dueTracker) throw new Error("Due tracker not found");

    if (status === "borrowed") {
      dueTracker.total_amount += diff;
      dueTracker.balance += diff;
    } else if (status === "paid") {
      dueTracker.paid_amount += Math.abs(diff);
      dueTracker.balance -= Math.abs(diff);
      if (dueTracker.balance < 0) dueTracker.balance = 0;
    }

    dueTracker.payment_method = payment_method || dueTracker.payment_method;
    dueTracker.status = status || dueTracker.status;
    await dueTracker.save();

    employee.Advance = dueTracker.balance;
    await employee.save();

    return { advance, dueTracker, employee, oldAmount };
  }

  // 👉 CHANGED FROM HARD DELETE TO SOFT DELETE
  async deleteAdvance(advanceId, userContext, tenantId) {
    const advance = await AdvanceRepository.findById({ _id: advanceId, tenantId });
    if (!advance) throw new Error("Advance record not found");

    const amountToDelete = advance.advance;
    const employeeId = advance.employee_id;
    const employee = await employees.findOne({ _id: employeeId, tenantId });

    // Flip flags instead of running deleteOne
    advance.isdeleted = true;
    advance.deletedinfo = {
      deleteddate: new Date(),
      deleteby: userContext?._id || null,
      module: "Advance", // Matches our backend mapping parser string exactly
    };
    await advance.save();

    const dueTracker = await duetrackers.findOne({ employee_id: employeeId, tenantId });
    if (dueTracker) {
      dueTracker.total_amount = Math.max(0, dueTracker.total_amount - amountToDelete);
      dueTracker.balance = Math.max(0, dueTracker.balance - amountToDelete);
      await dueTracker.save();
    }

    if (employee) {
      await employees.updateOne(
        { _id: employeeId, tenantId },
        { $set: { Advance: dueTracker?.balance || 0 } },
      );
      employee.Advance = dueTracker?.balance || 0;
    }

    return { amountToDelete, employee };
  }

  // 👉 EXCLUDES DELETED RECORDS FROM ACTIVE VIEW
  async getAllAdvances(branchName, tenantId) {
    const query = { isdeleted: { $ne: true }, tenantId };
    if (branchName) query.branchName = branchName;
    return await AdvanceRepository.findAll(query);
  }

  async exportExcel(branchName, tenantId) {
    const advances = await this.getAllAdvances(branchName, tenantId);
    if (!advances.length) throw new Error("No advance records found");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Advance Export");
    sheet.addRow(["S_No", "Name", "Salary", "Advance", "Paid", "Balance", "Status"]);
    sheet.getRow(1).font = { bold: true };

    advances.forEach((row, index) => {
      sheet.addRow([
        index + 1,
        row.staff_name || "-",
        row.salary || 0,
        row.advance || 0,
        row.paid || 0,
        row.balance || 0,
        row.status || "Pending",
      ]);
    });

    sheet.columns = [
      { width: 8 },
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
    ];
    return await workbook.xlsx.writeBuffer();
  }
}

export default new AdvanceService();