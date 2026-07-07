import Repository from "./ebill.repository.js";
import attendance from "../../attendance/residentsAttendance/residentsAttendance.model.js";
// import room from "../../../models/room.js";
import room from "../../roomAndResidents/Room&Residence.model.js";
import register from "../../register/register.model.js";
import { sortRooms } from "../../../utils/roomsorter.js";
import { getConfig } from "../../../utils/businessConfig.js";
import {
  sendWhatsappMessageRoomrent,
  sendWhatsappMessageremainder,
  payment_confirmation,
} from "../../../utils/whatsapp.js";

const monthMap = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

class ElectricityBillService {
  async addBills(data, user, tenantId) {
    const { RoomNo, Month, PrevMonth, CurrentMonth, Status = "Unpaid" } = data;
    const branchName =
      user.role === "Admin" ? data.branchName : user.branchName;

    const monthNormalized = Month.toLowerCase().trim();
    let billMonthIndex = monthMap[monthNormalized.replace(/[0-9]/g, "").trim()];
    let billYear = new Date().getFullYear();

    const yearMatch = Month.match(/\b(20\d{2})\b/);
    if (yearMatch) billYear = Number(yearMatch[1]);
    else if (billMonthIndex > new Date().getMonth()) billYear -= 1;

    const roomDetails = await room.findOne({ RoomNo, branchName, tenantId });
    let users = await register.find({ RoomNo, branchName, tenantId, isdeleted: { $ne: true } });

    users = users.filter((u) => {
      if (u.status === "vacated" && u.vacatedate) {
        const vDate = new Date(u.vacatedate);
        if (vDate.getFullYear() < billYear || (vDate.getFullYear() === billYear && vDate.getMonth() < billMonthIndex)) {
          return false;
        }
      }
      return true;
    });

    if (!roomDetails || !users.length)
      throw new Error("Room or active Users not found");

    const existing = await Repository.find({
      RoomNo,
      Month: monthNormalized,
      branchName,
      tenantId,
    });
    if (
      existing.some(
        (b) => (b.Year || new Date(b.createdAt).getFullYear()) === billYear,
      )
    ) {
      throw new Error("Bill already exists for this period");
    }

    const totalunit = CurrentMonth - PrevMonth;
    // const Amount = totalunit * 10;
    const ebRatePerUnit = await getConfig("ebRatePerUnit", 10);
    const config = await getConfig(tenantId);
    const Amount = totalunit * config.ebRatePerUnit;
    const startOfMonth = new Date(billYear, billMonthIndex, 1);
    const endOfMonth = new Date(billYear, billMonthIndex + 1, 0, 23, 59, 59);

    const { fullPayers, discountPayers } = users.reduce(
      (acc, u) => {
        const join = new Date(u.DateOfJoining);
        const joinedAfter15 =
          join.getFullYear() === billYear &&
          join.getMonth() === billMonthIndex &&
          join.getDate() >= 15;
        joinedAfter15 ? acc.discountPayers.push(u) : acc.fullPayers.push(u);
        return acc;
      },
      { fullPayers: [], discountPayers: [] },
    );

    const adjustedDivisor = fullPayers.length + 0.5 * discountPayers.length;
    const baseElectricityShare =
      adjustedDivisor > 0 ? Amount / adjustedDivisor : 0;

    const billEntries = [];
    for (const u of users) {
      const join = new Date(u.DateOfJoining);
      const joinedAfter15 =
        join.getFullYear() === billYear &&
        join.getMonth() === billMonthIndex &&
        join.getDate() >= 15;

      const attendanceRecords = await attendance.find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
        branchName,
        tenantId,
        "attendanceList.userId": u._id,
      });

      let totalPresent = attendanceRecords.filter((r) =>
        r.attendanceList.find(
          (a) => a.userId?.toString() === u._id.toString() && a.status === true,
        ),
      ).length;

      const electricityShare = joinedAfter15
        ? baseElectricityShare * 0.5
        : baseElectricityShare;
      let total = Math.round(electricityShare) + roomDetails.Rate;
      if (u.DiscountAmt > 0) total = Math.max(total - u.DiscountAmt, 0);

      const lastDigit = total % 10;
      if (lastDigit >= 1 && lastDigit <= 4) total = total - lastDigit + 5;
      else if (lastDigit >= 6 && lastDigit <= 9) total = total - lastDigit + 10;

      const lastBill = await Repository.findLastSNo(tenantId);
      const newBill = await Repository.create({
        SNo: (lastBill?.SNo || 0) + 1,
        RoomNo,
        FloorNo: roomDetails.Floor || "F1",
        Month: monthNormalized,
        Year: billYear,
        PrevMonth,
        CurrentMonth,
        Units: totalunit,
        Amount,
        Sharing: users.length,
        PerHead: electricityShare,
        Roomrent: roomDetails.Rate,
        total,
        Status,
        UserID: u._id,
        UserName: u.Name,
        branchName,
        IsDiscounted: joinedAfter15,
        TotalPresent: totalPresent,
        tenantId,
      });
      billEntries.push(newBill);
    }
    return billEntries;
  }

  async updateBill(id, updateData, tenantId) {
    const bill = await Repository.findById({ _id: id, tenantId });
    if (!bill) throw new Error("Bill not found");

    if (updateData.FloorNo) {
      bill.FloorNo = updateData.FloorNo;
    } else if (!bill.FloorNo) {
      bill.FloorNo = "F1";
    }

    const previousStatus = bill.Status;
    const effectiveYear = updateData.Year
      ? Number(updateData.Year)
      : bill.Year || new Date(bill.createdAt).getFullYear();

    if (
      updateData.Month &&
      updateData.Month.toLowerCase().trim() !== bill.Month
    ) {
      const normalized = updateData.Month.toLowerCase().trim();
      const dupes = await Repository.find({
        RoomNo: bill.RoomNo,
        branchName: bill.branchName,
        UserID: bill.UserID,
        Month: normalized,
        tenantId,
        _id: { $ne: id },
      });
      if (
        dupes.some(
          (b) =>
            (b.Year || new Date(b.createdAt).getFullYear()) === effectiveYear,
        )
      ) {
        throw new Error("Duplicate bill exists for the new month/year");
      }
      bill.Month = normalized;
      bill.Year = effectiveYear;
    }

    if (
      updateData.CurrentMonth !== undefined &&
      updateData.CurrentMonth !== bill.CurrentMonth
    ) {
      bill.CurrentMonth = updateData.CurrentMonth;
      bill.Units = bill.CurrentMonth - bill.PrevMonth;
      bill.Amount = bill.Units * 10;
      // Keep the same discount logic if it was discounted initially
      const shareRatio = bill.IsDiscounted ? 0.5 : 1;
      bill.PerHead = (bill.Amount / (bill.Sharing > 0 ? bill.Sharing : 1)) * shareRatio;
      
      // Recalculate total
      let newTotal = Math.round(bill.PerHead) + bill.Roomrent;
      const lastDigit = newTotal % 10;
      if (lastDigit >= 1 && lastDigit <= 4) newTotal = newTotal - lastDigit + 5;
      else if (lastDigit >= 6 && lastDigit <= 9) newTotal = newTotal - lastDigit + 10;
      
      bill.total = newTotal - Number(bill.DisAmt || 0) + Number(bill.Extras || 0);
    }

    // Handle custom DisAmt / Extras updates if they were passed in this edit
    if (updateData.DisAmt !== undefined || updateData.Extras !== undefined) {
      const baseTotal = bill.total + Number(bill.DisAmt || 0) - Number(bill.Extras || 0);
      bill.DisAmt = updateData.DisAmt !== undefined ? Number(updateData.DisAmt) : bill.DisAmt;
      bill.Extras = updateData.Extras !== undefined ? Number(updateData.Extras) : bill.Extras;
      bill.total = baseTotal + bill.Extras - bill.DisAmt;
    }
    bill.Status = updateData.Status;

    if (updateData.paymethod) bill.paymethod = updateData.paymethod;
    if (bill.Status === "Paid") {
      bill.paymentdate = updateData.paymentdate
        ? new Date(updateData.paymentdate)
        : bill.paymentdate || new Date();
    }

    await bill.save();

    if (previousStatus !== "Paid" && bill.Status === "Paid") {
      const user = await register.findOne({ _id: bill.UserID, tenantId });
      const phone = user?.SameAsWhatsapp ? user?.MobileNo : user?.Whatsapp;
      if (phone) await payment_confirmation(phone, user.Name, bill.total);
    }
    return bill;
  }


  // 👉 Soft Delete handler updating document flags seamlessly
  async deleteBillService(id, userContext, tenantId) {
    const bill = await Repository.findById({ _id: id, tenantId });
    if (!bill) throw new Error("Bill not found");

    bill.isdeleted = true;
    bill.deletedinfo = {
      deleteddate: new Date(),
      deleteby: userContext?._id || null,
      module: "ElectricityBill", // Maps precisely to backend map parser dictionary keys
    };
    return await bill.save();
  }

  async getBills(query, user, tenantId) {
    const branchName =
      user.role === "Admin" ? query.branchName : user.branchName;
    if (!branchName) throw new Error("Branch name required");

    await this.sendAutoReminders(branchName);

    // 👉 FIXED: Explicitly isolate active records from items inside the Recycle Bin
    const filter = { 
      branchName,
      tenantId,
      isdeleted: { $ne: true } 
    };
    
    if (query.month && query.month.toLowerCase() !== "all")
      filter.Month = query.month.toLowerCase();

    let bills = await Repository.find(filter);
    if (query.year && query.year !== "all") {
      const yr = Number(query.year);
      bills = bills.filter(
        (b) => (b.Year ?? new Date(b.createdAt).getFullYear()) === yr,
      );
    }
    return sortRooms(bills);
  }



  async sendAutoReminders(branchName, tenantId) {
    const today = new Date();
    if (today.getDate() !== 7) return;

    const monthName = today.toLocaleString("default", { month: "long" });
    const monthYear = `${monthName} ${today.getFullYear()}`;
    const unpaid = await Repository.find({
      Status: /Unpaid/i,
      branchName,
      tenantId,
      Month: monthYear,
    });

    for (const bill of unpaid) {
      const user = await register.findOne({ _id: bill.UserID, tenantId });
      const phone = user?.SameAsWhatsapp ? user?.MobileNo : user?.Whatsapp;
      if (phone)
        await sendWhatsappMessageremainder(
          phone,
          user.Name,
          monthYear,
          bill.total,
          today.toLocaleDateString("en-GB"),
        );
    }
  }

  async sendRoomWhatsapp(RoomNo, Month, user, tenantId) {
    const branchName =
      user.role === "Admin" ? user.branchName : user.branchName; // Logic from file
    const bills = await Repository.find({
      RoomNo,
      Month: Month.toLowerCase(),
      branchName,
      tenantId,
      Status: "Unpaid",
    });
    if (!bills.length) throw new Error("No unpaid bills found");

    const monthIndex = monthMap[Month.toLowerCase()];
    const dueDate = new Date(
      new Date().getFullYear(),
      monthIndex,
      4,
    ).toLocaleDateString("en-IN");

    for (const bill of bills) {
      const u = await register.findOne({ _id: bill.UserID, tenantId });
      if (u?.Whatsapp)
        await sendWhatsappMessageRoomrent(
          u.Whatsapp,
          u.Name,
          bill.total,
          Month,
          dueDate,
        );
    }
  }
}

export default new ElectricityBillService();
