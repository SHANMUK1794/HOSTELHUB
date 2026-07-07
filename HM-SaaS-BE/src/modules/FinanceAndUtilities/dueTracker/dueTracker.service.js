import DueTrackerRepository from "./dueTracker.repository.js";
import employees from "../../employee/employee.model.js";
import advances from "../advance/advance.model.js";

class DueTrackerService {
  async createOrUpdateDue(data, tenantId) {
    const { employee_id, payamount, borrowedamount, payment_method, date } =
      data;

    let status = "neutral";
    let amount = 0;

    if (borrowedamount > 0) {
      status = "borrowed";
      amount = borrowedamount;
    } else if (payamount > 0) {
      status = "paid";
      amount = payamount;
    } else {
      throw new Error(
        "Either payamount or borrowedamount must be greater than 0",
      );
    }

    const employee = await employees.findOne({ _id: employee_id, tenantId });
    if (!employee) throw new Error("Employee not found");

    let advance = await advances.findOne({ employee_id, tenantId });
    let prevBalance;

    if (!advance) {
      advance = new advances({
        employee_id,
        staff_name: employee.staff_name,
        salary: employee.Salary,
        mobile: employee.Mobile,
        advance: status === "borrowed" ? amount : 0,
        paid: status === "paid" ? amount : 0,
        balance: status === "borrowed" ? amount : -amount, // Logic per original file
        tenantId,
      });
    } else {
      prevBalance = advance.balance;
      if (status === "borrowed") {
        advance.advance += amount;
        advance.balance += amount;
        advance.status = "Pending";
      } else if (status === "paid") {
        advance.paid += amount;
        advance.balance -= amount;
        advance.balance <= 0
          ? ((advance.balance = 0), (advance.status = "Paid"))
          : (advance.status = "Pending");
      }
    }

    await advance.save();

    const dueTracker = await DueTrackerRepository.create({
      employee_id,
      total_amount: prevBalance,
      paid_amount: amount,
      balance: advance.balance,
      status: status,
      payment_method,
      date: date || new Date(),
      tenantId,
    });

    if (status === "borrowed") {
      employee.Advance = (employee.Advance || 0) + amount;
    } else if (status === "paid") {
      employee.Advance = Math.max(0, (employee.Advance || 0) - amount);
    }
    await employee.save();

    return { advance, dueTracker, employee, status };
  }

  async updateDueTracker(id, updateData, tenantId) {
    const { total_amount, paid_amount, payment_method, date } = updateData;
    const dueTracker = await DueTrackerRepository.findById({ _id: id, tenantId });
    if (!dueTracker) throw new Error("Due tracker not found");

    const employee = await employees.findOne({ _id: dueTracker.employee_id, tenantId });
    const advance = await advances.findOne({
      employee_id: dueTracker.employee_id,
      tenantId,
    });
    if (!employee || !advance)
      throw new Error("Employee or advance record not found");

    const oldTotalAmount = dueTracker.total_amount;
    const oldPaidAmount = dueTracker.paid_amount;
    const newTotalAmount =
      total_amount !== undefined ? parseFloat(total_amount) : oldTotalAmount;
    const newPaidAmount =
      paid_amount !== undefined ? parseFloat(paid_amount) : oldPaidAmount;

    const totalAmountDiff = newTotalAmount - oldTotalAmount;
    const paidAmountDiff = newPaidAmount - oldPaidAmount;

    dueTracker.total_amount = newTotalAmount;
    dueTracker.paid_amount = newPaidAmount;
    dueTracker.balance = Math.max(0, newTotalAmount - newPaidAmount);
    dueTracker.payment_method = payment_method ?? dueTracker.payment_method;
    dueTracker.date = date || dueTracker.date;
    await dueTracker.save();

    // Update advance record
    advance.advance += totalAmountDiff;
    advance.paid += paidAmountDiff;
    advance.balance = Math.max(
      0,
      advance.balance + totalAmountDiff - paidAmountDiff,
    );
    await advance.save();

    employee.Advance = advance.balance;
    await employee.save();

    return { dueTracker, advance, totalAmountDiff, paidAmountDiff };
  }

  async deleteDueTracker(id, tenantId) {
    const tracker = await DueTrackerRepository.findById({ _id: id, tenantId });
    if (!tracker) throw new Error("Due tracker not found");

    const employee = await employees.findOne({ _id: tracker.employee_id, tenantId });
    const advance = await advances.findOne({
      employee_id: tracker.employee_id,
      tenantId,
    });
    if (!employee || !advance)
      throw new Error("Employee or advance record not found");

    if (tracker.status === "borrowed") {
      advance.advance = Math.max(0, advance.advance - tracker.total_amount);
      advance.balance = Math.max(0, advance.balance - tracker.total_amount);
    } else if (tracker.status === "paid") {
      advance.paid = Math.max(0, advance.paid - tracker.paid_amount);
      advance.balance += tracker.paid_amount;
    }

    await advance.save();
    employee.Advance = advance.balance;
    await employee.save();

    const deletedTracker = tracker.toObject();
    await DueTrackerRepository.findByIdAndDelete({ _id: id, tenantId });

    return { deletedTracker, advance };
  }

  async getDueByEmployee(employeeId, tenantId) {
    const employee = await employees.findOne({ _id: employeeId, tenantId });
    if (!employee) throw new Error("Employee not found");

    const dueTrackers = await DueTrackerRepository.findByEmployeeId(employeeId, tenantId);
    return { dueTrackers };
  }
}

export default new DueTrackerService();
