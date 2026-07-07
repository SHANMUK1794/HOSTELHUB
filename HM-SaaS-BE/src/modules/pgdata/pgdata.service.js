import * as pgRepo from "./pgdata.repository.js";
import * as vacationForm from "../vacationForm/vacationform.repository.js";
import RoomRentRepository from "../FinanceAndUtilities/RoomRent/roomRent.repository.js";
import { updateRoomOccupied } from "../../utils/updateRoomOccupied.js";
import roomModel from "../roomAndResidents/Room&Residence.model.js";
import Counter from "../../models/counter.js";
import {
  buildBranchFilter,
  DateOfJoining,
  stayedInMonth,
} from "../../utils/filter.js";

import { sortUsersByRoomAndJoining } from "../../utils/roomsorter.js";

import ExcelJS from "exceljs";

class PgDataService {
  normalizeDate(dateStr) {
    if (!dateStr) return null;

    const [year, month, day] = dateStr.split("-").map(Number);

    if (!year || !month || !day) {
      return null;
    }

    return new Date(Date.UTC(year, month - 1, day));
  }

  calculateFinancials(
    checkin,
    checkout,
    costPerDay = 0,
    discount = 0,
    advance = 0,
    manualDays,
    manualRent,
  ) {
    let dayStayed = manualDays || 1;

    if (checkin && checkout && !manualDays) {
      const diff = new Date(checkout).getTime() - new Date(checkin).getTime();
      dayStayed = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    if (dayStayed < 1) dayStayed = 1;

    // Use manualRent if provided (from frontend), otherwise calculate
    const finalRent = manualRent
      ? Number(manualRent)
      : Number(dayStayed) * Number(costPerDay);
    const totalPayable = finalRent - Number(discount || 0);
    const due = Math.max(0, totalPayable - Number(advance || 0));

    return {
      dayStayed,
      Rent: finalRent,
      due,
      Paymentstatus: due <= 0 ? "paid" : "pending",
    };
  }

  formatForPrefill(user) {
    if (!user) return null;

    const u = user.toObject ? user.toObject() : user;

    return {
      ...u,

      _id: u._id?.toString(),

      checkin: u.checkin || "",
      checkout: u.checkout || "",

      DateOfJoining: u.checkin || "",
      DateOfLeaving: u.checkout || "",

      Whatsapp: u.Whatsapp || u.MobileNo || "",

      Discount: u.Discount ?? 0,

      advance: u.advance ?? 0,
    };
  }

  validatePgData(data, checkin, checkout) {
  // Mobile
  if (!/^\d{10}$/.test(data.MobileNo)) {
    throw new Error("Mobile number must be 10 digits");
  }

  // Aadhaar
  if (data.AddharNumber && !/^\d{12}$/.test(data.AddharNumber)) {
    throw new Error("Aadhaar number must be 12 digits");
  }

  // DOB (when you add DOB field)
  if (data.DateOfBirth) {
    const dob = new Date(data.DateOfBirth);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (dob > today) {
      throw new Error("Date of birth cannot be a future date");
    }
  }

  // Check-in / Check-out
  if (checkin && checkout) {
    if (checkout <= checkin) {
      throw new Error(
        "Check-out date must be after check-in date"
      );
    }
  }
}

async validateDuplicateFields(data, tenantId, excludeId = null) {
  // Mobile
  if (data.MobileNo) {
    const existingMobile = await pgRepo.findOne({
      tenantId,
      MobileNo: data.MobileNo,
    });

    if (
      existingMobile &&
      existingMobile._id.toString() !== excludeId
    ) {
      throw new Error("Mobile number already exists.");
    }
  }

  // Aadhaar
  if (data.AddharNumber) {
    const existingAadhaar = await pgRepo.findOne({
      tenantId,
      AddharNumber: data.AddharNumber,
    });

    if (
      existingAadhaar &&
      existingAadhaar._id.toString() !== excludeId
    ) {
      throw new Error("Aadhaar number already exists.");
    }
  }
}

  async registerUser(data, user, tenantId) {
    const branchName =
      user.role === "Admin" ? data.branchName : user.branchName;

    if (!data.Name) throw new Error("Name is required");
    if (!data.MobileNo) throw new Error("Mobile number is required");
    if (!data.Reason) throw new Error("Reason is required");
    if (!data.PaymentMethod) throw new Error("Payment method is required");

    const checkin = this.normalizeDate(data.checkin);
    const checkout = this.normalizeDate(data.checkout);
    this.validatePgData(data, checkin, checkout);

    await this.validateDuplicateFields(data, tenantId);

    // 🔧 FIX: validate room + capacity, same pattern register.service.js uses
    let room = null;
    if (data.RoomNo) {
      room = await roomModel.findOne({
        tenantId,
        branchName,
        RoomNo: data.RoomNo,
      });

      if (!room) throw new Error("Room not found.");

      const activePg = await pgRepo.count({
          tenantId,
          branchName,
          RoomNo: data.RoomNo,
          staying: true,
      });

      const occupiedCount =
          (room.users?.length || 0) + activePg;

      if (occupiedCount >= room.Capacity) {
        throw new Error(`Room ${data.RoomNo} is fully occupied.`);
      }
    }

    const financials = this.calculateFinancials(
      checkin,
      checkout,
      data.costPerDay,
      data.Discount,
      data.advance,
      data.dayStayed,
    );

    // Generate atomic sequential Bill Number per tenant
    const counter = await Counter.findOneAndUpdate(
      { tenantId, name: "pgBillNo" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    const generatedBillNo = counter.value.toString();

    const newUser = await pgRepo.create({
      ...data,
      BillNo: generatedBillNo,
      tenantId,
      branchName,
      checkin,
      checkout,
      dayStayed: financials.dayStayed,
      Rent: financials.Rent,
      due: financials.due,
      Paymentstatus: financials.Paymentstatus,
      status: data.status || "staying",
      staying: true,
    });

    // 🔧 FIX: link the new PG user into the room so Occupied reflects reality
    if (room) {
      room.pgUsers.push({ name: newUser.Name, pgUserId: newUser._id });
      room.Occupied = (room.users?.length || 0) + room.pgUsers.length;
      await room.save();
      await updateRoomOccupied(
          tenantId,
          branchName,
          data.RoomNo
      );
    }

    return this.formatForPrefill(newUser);
  }

  async getAllUsers(user, query, tenantId) {
    let branchName = query.branchName;

    if (!branchName || branchName === "undefined") {
      branchName =
        user.role === "Warden" ? user.branchName : user.selectedBranch;
    }

    const branchFilter = buildBranchFilter(user, branchName);

    let dateFilter = {};

    const isValidMonth = query.month && query.month !== "undefined";

    const isValidYear = query.year && query.year !== "undefined";

    if (isValidMonth && isValidYear) {
      dateFilter = stayedInMonth(
        query.month,
        query.year,
        "checkin",
        "checkout"
      );
    }

    const users = await pgRepo.findMany({
      tenantId,
      ...branchFilter,
      ...dateFilter,
    });

    const formattedUsers = users.map((u) => this.formatForPrefill(u));

    const sorted = sortUsersByRoomAndJoining(formattedUsers);

    const totalCount = await pgRepo.count({
      tenantId,
      ...branchFilter,
      staying: true,
    });

    return {
      users: sorted,
      totalCount,
    };
  }

  async updateUser(id, updateData, role, tenantId) {
    const existing = await pgRepo.findById({ _id: id, tenantId });

    if (!existing) {
      throw new Error("User not found");
    }

    const checkin = updateData.checkin
      ? this.normalizeDate(updateData.checkin)
      : existing.checkin;

    const checkout = updateData.checkout
      ? this.normalizeDate(updateData.checkout)
      : existing.checkout;

    const dataToValidate = {
      MobileNo: updateData.MobileNo || existing.MobileNo,
      AddharNumber:
        updateData.AddharNumber || existing.AddharNumber,
    };

    this.validatePgData(
      dataToValidate,
      checkin,
      checkout
    );

    await this.validateDuplicateFields(
      dataToValidate,
      tenantId,
      id // exclude current record
    );

    const financials = this.calculateFinancials(
      checkin,
      checkout,
      updateData.costPerDay || existing.costPerDay,
      updateData.Discount || existing.Discount,
      updateData.advance || existing.advance,
      updateData.dayStayed || existing.dayStayed,
    );

    const oldRoomNo = existing.RoomNo;
    const newRoomNo = updateData.RoomNo ?? existing.RoomNo;
    const isVacating =
    updateData.staying === false ||
    updateData.status === "vacated" ||
    updateData.status === "vacating";
    const isChangingRoom = newRoomNo && newRoomNo !== oldRoomNo;

    // 🔧 FIX: remove from the OLD room's pgUsers if vacating or moving rooms
    if ((isVacating || isChangingRoom) && oldRoomNo) {
      const oldRoom = await roomModel.findOne({
        branchName: existing.branchName,
        RoomNo: oldRoomNo,
        tenantId,
      });

      if (oldRoom) {
        oldRoom.pgUsers = oldRoom.pgUsers.filter(
          (pu) => pu.pgUserId?.toString() !== existing._id.toString(),
        );
        oldRoom.Occupied =
          (oldRoom.users?.length || 0) + oldRoom.pgUsers.length;
        await oldRoom.save();
        await updateRoomOccupied(
            tenantId,
            existing.branchName,
            oldRoomNo
        );
      }
    }

    // 🔧 FIX: add to the NEW room's pgUsers if moving rooms or reactivating into a room
    if (
      !isVacating &&
      newRoomNo &&
      (isChangingRoom || existing.status === "vacated")
    ) {
      const newRoom = await roomModel.findOne({
        branchName: existing.branchName,
        RoomNo: newRoomNo,
        tenantId,
      });

      if (newRoom) {
        const occupiedCount =
          (newRoom.users?.length || 0) + newRoom.pgUsers.length;

        if (occupiedCount >= newRoom.Capacity) {
          throw new Error(`Room ${newRoomNo} is fully occupied.`);
        }

        const alreadyIn = newRoom.pgUsers.some(
          (pu) => pu.pgUserId?.toString() === existing._id.toString(),
        );

        if (!alreadyIn) {
          newRoom.pgUsers.push({
            name: updateData.Name || existing.Name,
            pgUserId: existing._id,
          });
          newRoom.Occupied =
            (newRoom.users?.length || 0) + newRoom.pgUsers.length;
          await newRoom.save();
          await updateRoomOccupied(
              tenantId,
              existing.branchName,
              newRoomNo
          );
        }
      }
    }

    const updated = await pgRepo.updateById(
      { _id: id, tenantId },
      {
        ...updateData,
        checkin,
        checkout,
        dayStayed: financials.dayStayed,
        Rent: financials.Rent,
        due: financials.due,
        staying: updateData.status !== "vacated",
        Paymentstatus: financials.Paymentstatus,
      },
    );

    return this.formatForPrefill(updated);
  }

  async deactivateUser(id, payload, tenantId) {
    const existing = await pgRepo.findById({ _id: id, tenantId });

    if (!existing) {
      throw new Error("User not found");
    }

    const updateData = {
      status: payload.status,
    };

    // ================= DEACTIVATE =================
    if (payload.status === "vacated") {
      updateData.staying = false;

      updateData.checkout = payload.checkout
        ? this.normalizeDate(payload.checkout)
        : new Date();

      // 🔧 FIX: remove from pgUsers (was incorrectly pulling from `users`)
      if (existing.RoomNo) {
        const room = await roomModel.findOne({
          branchName: existing.branchName,
          RoomNo: existing.RoomNo,
          tenantId,
        });

        if (room) {
          room.pgUsers = room.pgUsers.filter(
            (pu) => pu.pgUserId?.toString() !== existing._id.toString(),
          );
          room.Occupied = (room.users?.length || 0) + room.pgUsers.length;
          await room.save();
          await updateRoomOccupied(
              tenantId,
              existing.branchName,
              existing.RoomNo
          );
        }
      }
    }

    // ================= ACTIVATE =================
    if (payload.status === "staying") {
      updateData.staying = true;
      updateData.checkout = null;

      // 🔧 FIX: add back into pgUsers (respecting capacity)
      if (existing.RoomNo) {
        const room = await roomModel.findOne({
          branchName: existing.branchName,
          RoomNo: existing.RoomNo,
          tenantId,
        });

        if (room) {
          const alreadyIn = room.pgUsers.some(
            (pu) => pu.pgUserId?.toString() === existing._id.toString(),
          );

          if (!alreadyIn) {
            const occupiedCount =
              (room.users?.length || 0) + room.pgUsers.length;

            if (occupiedCount >= room.Capacity) {
              throw new Error(`Room ${existing.RoomNo} is fully occupied.`);
            }

            room.pgUsers.push({ name: existing.Name, pgUserId: existing._id });
            room.Occupied = (room.users?.length || 0) + room.pgUsers.length;
            await room.save();
            await updateRoomOccupied(
    tenantId,
    existing.branchName,
    existing.RoomNo
);
          }
        }
      }

      await vacationForm.deleteFormRepo({
        tenantId,
        mobile: existing.MobileNo,
      });
    }

    const updated = await pgRepo.updateById({ _id: id, tenantId }, updateData);

    return this.formatForPrefill(updated);
  }

  async searchByMobile(mobile, tenantId) {
    const user = await pgRepo.findOne({
      tenantId,
      MobileNo: mobile,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return this.formatForPrefill(user);
  }

  async deleteUser(id, tenantId) {
    const user = await pgRepo.findById({ _id: id, tenantId });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.RoomNo) {
      const room = await roomModel.findOne({
        branchName: user.branchName,
        RoomNo: user.RoomNo,
        tenantId,
      });

      if (room) {
        room.pgUsers = room.pgUsers.filter(
          (pu) => pu.pgUserId?.toString() !== user._id.toString(),
        );
        room.Occupied = (room.users?.length || 0) + room.pgUsers.length;
        await room.save();
        await updateRoomOccupied(
    tenantId,
    user.branchName,
    user.RoomNo
);
      }
    }

    // 🔧 FIX: cascade soft-delete matching RoomRent record for this PG guest
    await RoomRentRepository.updateById(
      {
        MobileNo: Number(user.MobileNo),
        branchName: user.branchName,
        tenantId,
        isdeleted: { $ne: true },
      },
      {
        isdeleted: true,
        deletedinfo: {
          deleteddate: new Date(),
          deleteby: null,
          module: "pgdata",
        },
      },
    );

    return await pgRepo.deleteById({ _id: id, tenantId });
  }

  async generateExcel(user, query, tenantId) {
    let branchName = query.branchName;

    if (!branchName || branchName === "undefined") {
      branchName =
        user.role === "Warden" ? user.branchName : user.selectedBranch;
    }

    const branchFilter = buildBranchFilter(user, branchName);

    let dateFilter = {};

    if (query.month && query.year) {
      dateFilter = stayedInMonth(
        query.month,
        query.year,
        "checkin",
        "checkout"
      );
    }

    const users = await pgRepo.findMany({
      tenantId,
      ...branchFilter,
      ...dateFilter,
    });

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("PG Residents");

    worksheet.columns = [
      {
        header: "Branch",
        key: "branchName",
        width: 20,
      },
      {
        header: "Room No",
        key: "RoomNo",
        width: 10,
      },
      {
        header: "Bill No",
        key: "BillNo",
        width: 15,
      },
      {
        header: "Name",
        key: "Name",
        width: 25,
      },
      {
        header: "Mobile",
        key: "MobileNo",
        width: 15,
      },
      {
        header: "Reason",
        key: "Reason",
        width: 15,
      },
      {
        header: "Rent",
        key: "Rent",
        width: 10,
      },
      {
        header: "Due",
        key: "due",
        width: 10,
      },
    ];

    worksheet.getRow(1).font = {
      bold: true,
    };

    users.forEach((u) => {
      worksheet.addRow(u);
    });

    return await workbook.xlsx.writeBuffer();
  }

  async autoDeactivatePgUsers() {
    try {
      const now = new Date();
      // Match the normalizeDate logic (UTC midnight) so comparisons work regardless of server timezone
      const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

      // Find all PG users who are staying but their checkout date is today or strictly before today
      const pgMembersToDeactivate = await pgRepo.findMany({
        staying: true,
        checkout: { $lte: today, $ne: null }
      });

      for (const user of pgMembersToDeactivate) {
        // Deactivate user
        await pgRepo.updateById({ _id: user._id, tenantId: user.tenantId }, {
          staying: false,
          status: "vacated"
        });

        // Update room occupancy
        if (user.RoomNo) {
          const room = await roomModel.findOne({
            branchName: user.branchName,
            RoomNo: user.RoomNo,
            tenantId: user.tenantId,
          });

          if (room) {
            room.pgUsers = room.pgUsers.filter(
              (pu) => pu.pgUserId?.toString() !== user._id.toString()
            );
            room.Occupied = (room.users?.length || 0) + room.pgUsers.length;
            await room.save();
          }
        }
      }

      if (pgMembersToDeactivate.length > 0) {
        console.log(`✅ [CRON] Auto-deactivated ${pgMembersToDeactivate.length} PG users.`);
      }
    } catch (error) {
      console.error("❌ [CRON] Error in PG Auto-Deactivation:", error.message);
    }
  }
}

export default new PgDataService();