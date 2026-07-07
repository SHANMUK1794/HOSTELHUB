import Repository from "./roomRent.repository.js";
import room from "../../roomAndResidents/Room&Residence.model.js";
import registerModel from "../../register/register.model.js";
import ExcelJS from "exceljs";
import XLSX from "xlsx";
import { buildBranchFilter, buildCreatedAtFilter } from "../../../utils/filter.js";

import { getConfig } from "../../../utils/businessConfig.js";
import { payment_confirmation } from "../../../utils/whatsapp.js";
import pgdataModel from "../../pgdata/pgdata.model.js";


class RoomRentService {
  async createRoomRent(data, user, tenantId) {
    const { role, branchName: userBranch } = user;
    const {
      RoomNo,
      FloorNo,
      BillNo,
      ResidentName,
      MobileNo,
      Advance,
      DisAmt,
      PaymentMethod,
      branchName: bodyBranch,
    } = data;

    const branchName = role === "Admin" ? bodyBranch : userBranch;

    if (!ResidentName || !RoomNo || Advance === undefined || Advance === null)
      throw new Error("Please provide all required fields.");

    const existingUser = await Repository.findOne({
      branchName,
      MobileNo,
      tenantId,
      isdeleted: { $ne: true },
    });
    if (existingUser) throw new Error("User is already registered.");

    const roomDetails = await room.findOne({ RoomNo, branchName, tenantId });
    if (!roomDetails) throw new Error("Room number not found for this branch.");

    // RoomRent is Resident-only. PG guests must NOT be able to
    // create a RoomRent record, even via direct API call.
    const resident = await registerModel.findOne({
      MobileNo,
      tenantId,
      isdeleted: false,
    });
    if (!resident)
      throw new Error(
        "Resident not found with this mobile number in Register.",
      );

    const RoomRentAmt = roomDetails.Rate;
    const Registrationfee = data.Registrationfee
      ? Number(data.Registrationfee)
      : 0;
    const RoomDeposit = resident.Deposit || 0;
    const EBDeposit = data.EBDeposit ? Number(data.EBDeposit) : 0;

    let totalCalc =
      RoomRentAmt + RoomDeposit + EBDeposit + Registrationfee - (DisAmt || 0);

    if (Advance > totalCalc)
      throw new Error("Advance cannot be greater than Total.");

    const Balance = totalCalc - Advance;
    const Status = Balance > 0 ? "Pending" : "Paid";

    const initialHistory = Advance > 0 ? [{
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      amountPaid: Advance,
      balanceAfter: Balance,
      paymentMethod: PaymentMethod || "UPI"
    }] : [];

    const newRecord = await Repository.create({
      branchName, ResidentName, RoomNo, FloorNo, BillNo, MobileNo,
      RoomDeposit, RoomRent: RoomRentAmt, EBDeposit, Total: totalCalc,
      DisAmt, Advance, Balance, Status, PaymentMethod, tenantId,
      paymentHistory: initialHistory 
    });

    return await Repository.create({
      branchName,
      ResidentName,
      RoomNo,
      FloorNo,
      BillNo,
      MobileNo,
      RoomDeposit,
      RoomRent: RoomRentAmt,
      EBDeposit,
      Total: totalCalc,
      DisAmt,
      Advance,
      Balance,
      Status,
      PaymentMethod,
      tenantId,
      paymentHistory: initialHistory,
    });

    // 👉 WHATSAPP HOOK: Advance Payment Receipt
    if (Advance > 0) {
      try {
        const tenantSettings = await getConfig(tenantId);
        await payment_confirmation(MobileNo, ResidentName, Advance.toString(), tenantSettings);
      } catch (waErr) {
        console.log("WhatsApp Error (Room Rent Advance):", waErr.message);
      }
    }

    return newRecord;
  }

  async getAllRents(query, user, tenantId) {
    const branchName =
      user.role === "Admin"
        ? query.branchName || query.body?.branchName
        : user.branchName;
    const branchFilter = buildBranchFilter(user, branchName);
    const monthFilter = buildCreatedAtFilter(query.month, query.year);

    // 👉 FIXED: Explicitly filter out soft-deleted room rent rows
    return await Repository.find({
      ...branchFilter,
      ...monthFilter,
      isdeleted: { $ne: true },
      tenantId,
    });
  }

  async deleteRent(id, user, tenantId) {
    const record = await Repository.findById({ _id: id, tenantId });
    if (!record) throw new Error("Room rent record not found.");

    if (user.role === "Warden" && record.branchName !== user.branchName) {
      throw new Error(
        "Access Denied: Cannot delete records from other branches",
      );
    }

    record.isdeleted = true;
    record.deletedinfo = {
      deleteddate: new Date(),
      deleteby: user?._id || null,
      module: "RoomRent", 
    };

    return await record.save();
  }

  async generateExcelBuffer(query, user, tenantId) {
    const rents = await this.getAllRents(query, user, tenantId);
    if (!rents.length) throw new Error("No records found");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Room Deposit");

    sheet.addRow([
      "Sl.No",
      "Date",
      "Branch",
      "Room No",
      "Floor No",
      "Name",
      "Advance Paid",
    ]).font = { bold: true };

    rents.forEach((r, index) => {
      sheet.addRow([
        index + 1,
        r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB") : "",
        r.branchName,
        r.RoomNo,
        r.RoomNo,
        r.ResidentName,
        r.Advance || 0,
      ]);
    });

    sheet.columns = [
      { width: 8 },
      { width: 15 },
      { width: 25 },
      { width: 12 },
      { width: 25 },
      { width: 18 },
    ];
    return await workbook.xlsx.writeBuffer();
  }

  async updateRoomRent(id, updateData, user, tenantId) {
    const existingRecord = await Repository.findById({ _id: id, tenantId });
    if (!existingRecord) throw new Error("Room rent record not found.");

    if (
      user.role === "Warden" &&
      existingRecord.branchName !== user.branchName
    ) {
      throw new Error(
        "Access Denied: You cannot update records for other branches.",
      );
    }

    const newAdvance = Number(updateData.Advance ?? existingRecord.Advance);
    const newDisAmt = Number(updateData.DisAmt ?? existingRecord.DisAmt);

    const newTotal =
      (existingRecord.RoomRent || 0) +
      (existingRecord.Registrationfee || 0) +
      (existingRecord.RoomDeposit || 0) +
      (existingRecord.EBDeposit || 0) -
      newDisAmt;

    const newBalance = newTotal - newAdvance;

    let finalStatus = updateData.Status;
    if (!finalStatus || finalStatus === "Select Status") {
      finalStatus = newBalance <= 0 ? "Paid" : "Pending";
    }

    const finalUpdate = {
      ResidentName: updateData.ResidentName ?? existingRecord.ResidentName,
      RoomNo: updateData.RoomNo ?? existingRecord.RoomNo,
      FloorNo: updateData.FloorNo ?? existingRecord.FloorNo,
      BillNo: updateData.BillNo ?? existingRecord.BillNo, 
      MobileNo: updateData.MobileNo ?? existingRecord.MobileNo, 
      Advance: newAdvance,
      DisAmt: newDisAmt,
      Total: newTotal,
      Balance: newBalance < 0 ? 0 : newBalance,
      Status: finalStatus,
      PaymentMethod: updateData.PaymentMethod ?? existingRecord.PaymentMethod,
    };

    return await Repository.updateById({ _id: id, tenantId }, finalUpdate);
  }

  async addInstallment(id, installmentData, user, tenantId) {
    const existingRecord = await Repository.findById({ _id: id, tenantId });
    if (!existingRecord) throw new Error("Room rent record not found.");

    if (
      user.role === "Warden" &&
      existingRecord.branchName !== user.branchName
    ) {
      throw new Error(
        "Access Denied: You cannot add payments for other branches.",
      );
    }

    const amountPaid = Number(installmentData.amountPaid);
    if (!amountPaid || amountPaid <= 0)
      throw new Error("Invalid payment amount.");

    const calculatedBalance = (existingRecord.Balance || 0) - amountPaid;
    const finalBalance = calculatedBalance < 0 ? 0 : calculatedBalance;
    const finalStatus = finalBalance <= 0 ? "Paid" : "Pending";

    const newHistoryEntry = {
      date: installmentData.date || new Date().toISOString().split("T")[0],
      time:
        installmentData.time ||
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      amountPaid: amountPaid,
      balanceAfter: finalBalance, 
      paymentMethod: "UPI"
    };

    const finalUpdate = {
      Balance: finalBalance,
      Status: finalStatus,
      $push: { paymentHistory: newHistoryEntry },
    };

    const updatedRecord = await Repository.updateById({ _id: id, tenantId }, finalUpdate);

    // 👉 WHATSAPP HOOK: Installment Payment Receipt
    try {
      const tenantSettings = await getConfig(tenantId);
      await payment_confirmation(
        existingRecord.MobileNo, 
        existingRecord.ResidentName, 
        amountPaid.toString(), 
        tenantSettings
      );
    } catch (waErr) {
      console.log("WhatsApp Error (Room Rent Installment):", waErr.message);
    }

    return updatedRecord;
  }

  async bulkImport(file, tenantId) {
    if (!file) throw new Error("No file uploaded");
    const workbook = XLSX.readFile(file.path);
    const sheet = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
    );

    let inserted = 0;
    let duplicates = [];
    let errors = [];

    for (const row of sheet) {
      try {
        const { branchName, ResidentName, RoomNo, MobileNo } = row;
        const existing = await Repository.findOne({
          branchName,
          RoomNo,
          ResidentName,
          tenantId,
        });
        if (existing) {
          duplicates.push({ row, reason: "Duplicate entry" });
          continue;
        }
        await Repository.create({ ...row, tenantId });
        inserted++;
      } catch (err) {
        errors.push({ row, reason: err.message });
      }
    }
    return { inserted, duplicates, errors };
  }
}

export default new RoomRentService();