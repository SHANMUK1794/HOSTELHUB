import * as registerRepository from "./register.repository.js";
import { updateRoomOccupied } from "../../utils/updateRoomOccupied.js";
import rooms from "../../modules/roomAndResidents/Room&Residence.model.js";
import * as vacationForm from "../../modules/vacationForm/vacationform.repository.js";
import RoomRentRepository from "../FinanceAndUtilities/RoomRent/roomRent.repository.js";
import xlsx from "xlsx";
import Counter from "../../models/counter.js";
import { sendWhatsappMessage } from "../../utils/whatsapp.js";
import {
  buildBranchFilter,
  DateOfJoining,
  stayedInMonth,
} from "../../utils/filter.js";
import { sortUsersByRoomAndJoining } from "../../utils/roomsorter.js";

import { getConfig } from "../../utils/businessConfig.js";
/* ---------------- DATE PARSER ---------------- */
const parseDate = (input) => {
  if (!input) return null;

  if (!isNaN(input) && Number(input) > 10000) {
    return new Date(Math.round((input - 25569) * 86400 * 1000));
  }

  if (typeof input === "string") {
    const trimmed = input.trim();

    if (trimmed.includes("/")) {
      const [dd, mm, yyyy] = trimmed.split("/").map(Number);
      if (!isNaN(dd) && !isNaN(mm) && !isNaN(yyyy)) {
        return new Date(Date.UTC(yyyy, mm - 1, dd));
      }
    }

    if (trimmed.includes(".")) {
      const [dd, mm, yyyy] = trimmed.split(".").map(Number);
      if (!isNaN(dd) && !isNaN(mm) && !isNaN(yyyy)) {
        return new Date(Date.UTC(yyyy, mm - 1, dd));
      }
    }

    const d = new Date(trimmed);
    if (!isNaN(d)) return d;
  }

  return null;
};

/* ---------------- REGISTER USER ---------------- */
export const registerUser = async (body, userContext, tenantId) => {
  const { role } = userContext;

  const branchName =
    role === "Admin" ? body.branchName : userContext.branchName;

  const {
    DateOfJoining,
    Registerdate,
    RoomNo,
    BillNo,
    Name,
    DateOfBirth,
    MobileNo,
    SameAsWhatsapp,
    Whatsapp,
    Email,
    PermanentAddress,
    AddharNumber,
    FoodType,
    RoomType,
    Parking,
    vehicleNo,

    // NEW FIELDS
    FloorNo,
    Deposit,
    Discount,
    Advance,
  } = body;

  const inputDate = new Date(DateOfJoining);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate > today) {
    throw new Error("Future dates are not allowed");
  }
// Check duplicate Mobile Number
const existingMobile = await registerRepository.findOne({
  tenantId,
  branchName,
  MobileNo,
  isdeleted: false,
});

if (existingMobile) {
  throw new Error("Mobile Number already registered.");
}

// Check duplicate Aadhaar Number
const existingAadhaar = await registerRepository.findOne({
  tenantId,
  branchName,
  AddharNumber,
  isdeleted: false,
});

if (existingAadhaar) {
  throw new Error("Aadhaar Number already registered.");
}

// Check duplicate Email
const existingEmail = await registerRepository.findOne({
  tenantId,
  branchName,
  Email,
  isdeleted: false,
});

if (existingEmail) {
  throw new Error("Email already registered.");
}
 

  const room = await rooms.findOne({ tenantId, branchName, RoomNo });

  if (!room) throw new Error("Room not found.");

  // FIXED capacity logic
  // const activeUsersCount = await registerRepository.count({
  //   tenantId,
  //   branchName,
  //   RoomNo,
  //   staying: true,
  //   isdeleted: false,
  // });

  // if (activeUsersCount >= room.Capacity) {
  //   throw new Error(`Room ${RoomNo} is fully occupied.`);
  // }

  if (room.Occupied >= room.Capacity) {
  throw new Error(`Room ${RoomNo} is fully occupied.`);
}

  const parsedDOB = parseDate(DateOfBirth);
  const parsedDOJ = parseDate(DateOfJoining);
  const parsedDOR = parseDate(Registerdate);

  // Generate atomic sequential Bill Number per tenant (shared with PG)
  const counter = await Counter.findOneAndUpdate(
    { tenantId, name: "pgBillNo" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  const generatedBillNo = counter.value.toString();

  const newUser = await registerRepository.create({
  tenantId,
  branchName,
  DateOfJoining: parsedDOJ,
  Registerdate: parsedDOR,

  RoomNo,
  BillNo: generatedBillNo,
  Name,
  DateOfBirth: parsedDOB,
  MobileNo,
  SameAsWhatsapp,
  Whatsapp: SameAsWhatsapp ? MobileNo : Whatsapp,
  Email,
  PermanentAddress,
  AddharNumber,

  FoodType,
  RoomType,

  FloorNo,

  Deposit: Number(Deposit || 0),
  Discount: Number(Discount || 0),
  Advance: Number(Advance || 0),

  Parking,
  vehicleNo,
});

  room.users.push(newUser._id);
  await room.save();

  await updateRoomOccupied(
      tenantId,
      branchName,
      RoomNo
  );

 //Fetch tenant settings for WhatsApp triggers
  const tenantSettings = await getConfig(tenantId);
console.log("DEBUG - Tenant Settings:", tenantSettings);
  try {
    await sendWhatsappMessage(
      SameAsWhatsapp ? MobileNo : Whatsapp,
      Name,
      RoomNo,
      tenantSettings // 👉 Passes the toggle configuration
    );
  } catch (err) {
    console.warn("WhatsApp failed:", err.message);
  }

  return newUser;
};



/* ---------------- UPDATE USER ---------------- */
export const updateUser = async (id, body, userContext, tenantId) => {
  const { role } = userContext;
  const branchName =
    role === "Admin" ? body.branchName : userContext.branchName;

  const user = await registerRepository.findOne({ _id: id, tenantId });
  if (!user) throw new Error("User Not Found");

  const oldRoomNo = user.RoomNo;
  const wasStaying = user.staying;

  const {
  RoomNo,
  staying,
  vacatedate,
  DateOfJoining,
  DateOfBirth,
  Registerdate,
  SameAsWhatsapp,
  MobileNo,
  Whatsapp,
  FloorNo,
  AddharNumber,
  Email,
  Name,
  } = body;

  // Duplicate Mobile/Aadhaar validation
// Mobile duplicate
if (MobileNo) {
  const mobileExists = await registerRepository.findOne({
    tenantId,
    branchName,
    _id: { $ne: id },
    MobileNo,
  });

  if (mobileExists) {
    throw new Error("Mobile Number already registered.");
  }
}

// Aadhaar duplicate
if (AddharNumber) {
  const aadhaarExists = await registerRepository.findOne({
    tenantId,
    branchName,
    _id: { $ne: id },
    AddharNumber,
  });

  if (aadhaarExists) {
    throw new Error("Aadhaar Number already registered.");
  }
}

if (MobileNo !== undefined) {
  if (!/^\d{10}$/.test(String(MobileNo))) {
    throw new Error("Enter valid Mobile Number.");
  }
}

if (AddharNumber !== undefined) {
  if (!/^\d{12}$/.test(String(AddharNumber))) {
    throw new Error("Enter valid Aadhaar Number.");
  }
}

if (Email !== undefined && Email.trim() !== "") {
  const existingEmail = await registerRepository.findOne({
    tenantId,
    branchName,
    Email,
    _id: { $ne: id },
    isdeleted: false,
  });

  if (existingEmail) {
    throw new Error("Email already registered.");
  }
}

if (Email !== undefined) {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(Email)) {
    throw new Error("Enter valid Email.");
  }
}

if (Name !== undefined && !Name.trim()) {
  throw new Error("Name is required.");
}


if (DateOfJoining) {
  const doj = parseDate(DateOfJoining);

  if (!doj) {
    throw new Error("Invalid Date Of Joining.");
  }

  const today = new Date();

  today.setHours(0,0,0,0);
  doj.setHours(0,0,0,0);

  if (doj > today) {
    throw new Error("Future dates are not allowed.");
  }
}

  

  const effectiveRoomNo = RoomNo ?? user.RoomNo;

  const isChangingRoom =
    RoomNo !== undefined && RoomNo !== oldRoomNo;

  const isChangingStayingStatus =
    staying !== undefined && staying !== wasStaying;

  const parsedDOB = parseDate(DateOfBirth);

  let updateData = {
  branchName,
};

if (Name !== undefined)
  updateData.Name = Name.trim();

if (MobileNo !== undefined)
  updateData.MobileNo = MobileNo;

if (Email !== undefined)
  updateData.Email = Email.trim();

if (AddharNumber !== undefined)
  updateData.AddharNumber = AddharNumber;





if (body.FloorNo !== undefined) updateData.FloorNo = body.FloorNo;

if (body.Deposit !== undefined)
  updateData.Deposit = Number(body.Deposit);

if (body.Discount !== undefined)
  updateData.Discount = Number(body.Discount);

if (body.Advance !== undefined)
  updateData.Advance = Number(body.Advance);

  if (parsedDOB) updateData.DateOfBirth = parsedDOB;

  if (SameAsWhatsapp !== undefined) {
    updateData.Whatsapp = SameAsWhatsapp
      ? MobileNo || user.MobileNo
      : Whatsapp;
  }

  if (FloorNo !== undefined) {
    updateData.FloorNo = FloorNo;
  }

  // status logic
  if (staying !== undefined && effectiveRoomNo) {
    if (staying === true) {
      updateData.status = "staying";
      updateData.Rejoiningdate = new Date();
      updateData.vacatedate = null;
    } else {
      updateData.status = "vacated";
      updateData.vacatedate = vacatedate || new Date();
    }
  }

  // room change logic
  if (isChangingRoom || isChangingStayingStatus) {
    if (wasStaying && oldRoomNo) {
      const oldRoom = await rooms.findOne({ tenantId, branchName, RoomNo: oldRoomNo });
      if (oldRoom) {
        oldRoom.users.pull(user._id);
        await oldRoom.save();
        await updateRoomOccupied(
            tenantId,
            branchName,
            oldRoomNo
        );
      }
    }

    if (staying !== false && RoomNo) {
      const newRoom = await rooms.findOne({ tenantId, branchName, RoomNo });

      if (!newRoom) throw new Error("Room not found");

      // const activeUsersCount = await registerRepository.count({
      //   tenantId,
      //   branchName,
      //   RoomNo,
      //   staying: true,
      //   isdeleted: false,
      // });

      // if (activeUsersCount >= newRoom.Capacity) {
      //   throw new Error("Room is full");
      // }

      if (newRoom.Occupied >= newRoom.Capacity) {
        throw new Error("Room is full");
      }

      newRoom.users.push(user._id);
      await newRoom.save();
      await updateRoomOccupied(
          tenantId,
          branchName,
          RoomNo
      );

      updateData.RoomNo = RoomNo;
    }

    if (staying === false) {
      updateData.RoomNo = null;
    }
  }

  return await registerRepository.updateOne({ _id: id, tenantId }, updateData);
};

/* ---------------- BULK IMPORT ---------------- */
export const bulkImport = async (filePath, userContext, tenantId) => {
  const workbook = xlsx.readFile(filePath);
  const data = xlsx.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]]
  );

  let inserted = 0;
  let errors = [];
  let duplicates = [];

  for (const row of data) {
    try {
      const branchName = row.branchName.trim();
      const MobileNo = row.MobileNo.toString().trim();
      const AddharNumber = row.AddharNumber.toString().trim();

      const existing = await registerRepository.findOne({
        tenantId,
        branchName,
        $or: [{ MobileNo }, { AddharNumber }],
      });

      if (existing) {
        duplicates.push(row);
        continue;
      }

      const parsedDOJ = parseDate(row.DateOfJoining);
      const parsedDOB = parseDate(row.DateOfBirth);

      if (!parsedDOJ || !parsedDOB) {
        errors.push(row);
        continue;
      }

      await registerRepository.create({
        ...row,
        tenantId,
        branchName,
        DateOfJoining: parsedDOJ,
        DateOfBirth: parsedDOB,
        RoomNo: null,
        staying: false,
      });

      inserted++;
    } catch (err) {
      errors.push({ row, reason: err.message });
    }
  }

  return { inserted, duplicates, errors };
};

/* ---------------- OTHER FUNCTIONS (UNCHANGED LOGIC) ---------------- */

export const getUserByMobile = async (mobile, tenantId) => {
  const user = await registerRepository.findOne({ MobileNo: mobile, tenantId, isdeleted: false });
  if (!user) throw new Error("User not found");
  return user;
};

export const findAllUsers = async (userContext, query, tenantId) => {
  const branchName =
    userContext.role === "Warden"
      ? userContext.branchName
      : query.branchName || userContext.branchName;

  const filter = {
    tenantId,
    ...buildBranchFilter(userContext, branchName),
    ...stayedInMonth(
      query.month,
      query.year,
      "DateOfJoining",
      "vacatedate"
    ),
    isdeleted: false,
  };

  const users = await registerRepository.find(filter);
  return sortUsersByRoomAndJoining(users);
};

export const deactivateUser = async (id, vacatedate, userContext, tenantId) => {
  const user = await registerRepository.findOne({ _id: id, tenantId });

  if (!user) throw new Error("User Not Found");

  const updateData = {};

  if (vacatedate) {
    // ===== VACATING =====
    updateData.status = "vacated";
    updateData.vacatedate = vacatedate;
    updateData.staying = false;

    // 🔧 FIX: remove this resident from the room's occupancy list
    // so room.users.length (Occupied) drops immediately.
    if (user.RoomNo) {
      const room = await rooms.findOne({
        tenantId,
        branchName: user.branchName,
        RoomNo: user.RoomNo,
      });

      if (room) {
        room.users.pull(user._id);
        room.Occupied = room.users.length;
        await room.save();
        await updateRoomOccupied(
            tenantId,
            user.branchName,
            user.RoomNo
        );
      }
    }
  } else {
    // ===== ACTIVATING =====
    updateData.status = "staying";
    updateData.vacatedate = null;
    updateData.staying = true;

    // 🔧 FIX: when reactivating, put the resident back in the room's
    // occupancy list (only if there's space, and only if not already in it).
    if (user.RoomNo) {
      const room = await rooms.findOne({
        tenantId,
        branchName: user.branchName,
        RoomNo: user.RoomNo,
      });

      if (room) {
        const alreadyIn = room.users.some(
          (u) => u.toString() === user._id.toString(),
        );

        if (!alreadyIn) {
          if (room.Occupied >= room.Capacity) {
            throw new Error(`Room ${user.RoomNo} is fully occupied.`);
          }

          room.users.push(user._id);
          await room.save();

          await updateRoomOccupied(
            tenantId,
            user.branchName,
            user.RoomNo
          );
        }
      }
    }

    // Remove from vacation form when activating
    await vacationForm.deleteFormRepo({
      tenantId,
      $or: [{ mobile: user.MobileNo }, { mobile: user.Whatsapp }],
    });
  }

  const updatedUser = await registerRepository.updateOne(
    { _id: id, tenantId },
    updateData,
  );

  return {
    vacated: !!vacatedate,
    user: updatedUser,
  };
};

/* ---------------- SOFT DELETE USER (FIXED) ---------------- */
export const softDeleteUser = async (id, deletedBy, tenantId) => {
  const user = await registerRepository.findOne({ _id: id, tenantId });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.staying) {
    throw new Error("Deactivate the user first before deleting");
  }

  const result = await registerRepository.updateOne({ _id: id, tenantId }, {
    isdeleted: true,
    deletedinfo: {
      deleteddate: new Date(),
      deleteby: deletedBy,
      module: "register",
    },
  });

  // 🔧 FIX: cascade soft-delete to the matching RoomRent record so:
  //   1. The RoomRent page stops showing this resident after they're gone.
  //   2. The mobile number is freed up so a NEW resident/RoomRent record
  //      can be created with the same number later (createRoomRent's
  //      "User is already registered" check keys off isdeleted: false).
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
        deleteby: deletedBy,
        module: "register",
      },
    },
  );

  return result;
};

/* ---------------- GET DELETED USERS ---------------- */
export const getDeletedUsers = async (userContext, body, query, tenantId) => {
  const branchName =
    userContext.role === "Warden"
      ? userContext.branchName
      : query.branchName || userContext.branchName;

  const filter = {
    tenantId,
    ...buildBranchFilter(userContext, branchName),
    isdeleted: true,
  };

  return await registerRepository.find(filter);
};

/* ---------------- RECOVER USER ---------------- */
export const recoverUser = async (id, tenantId) => {
  const user = await registerRepository.findOne({ _id: id, tenantId });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isdeleted) {
    throw new Error("User is already active");
  }

  return await registerRepository.updateOne({ _id: id, tenantId }, {
    isdeleted: false,
    deletedinfo: {
      deleteddate: null,
      deleteby: null,
      module: "register",
    },
  });
};

/* ---------------- PERMANENT DELETE ONE ---------------- */
export const permanentDeleteUser = async (id, tenantId) => {
  const user = await registerRepository.findOne({ _id: id, tenantId });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isdeleted) {
    throw new Error("Move to trash first before permanent delete");
  }

  return await registerRepository.deleteMany({ _id: id, tenantId });
};

/* ---------------- PERMANENT DELETE ALL ---------------- */
export const permanentDeleteAllUsers = async (tenantId) => {
  return await registerRepository.deleteMany({
    tenantId,
    isdeleted: true,
  });
};