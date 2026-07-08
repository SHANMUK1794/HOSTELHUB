import XLSX from "xlsx";
import { sortRooms } from "../../utils/roomsorter.js";
import { buildBranchFilter } from "../../utils/filter.js";
import * as repo from "./Room&Residence.repository.js";
import register from "../register/register.model.js";
import PgData from "../pgdata/pgdata.model.js";

const createError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

export const bulkImportRooms = async (filePath, tenantId) => {
  if (!filePath) {
    throw createError("No file uploaded", 400);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  let inserted = 0;
  const duplicates = [];
  const errors = [];

  for (const row of sheet) {
    try {
      const branchName = row["branchName"]?.toString().trim();
      const RoomNo = row["RoomNo"]?.toString().trim();
      const Floor = row["Floor"]?.toString().trim();
      const RoomType = row["RoomType"]?.toString().trim();
      const Capacity = row["Capacity"] !== undefined ? Number(row["Capacity"]) : null;
      const Rate = row["Rate"] !== undefined ? Number(row["Rate"]) : null;

      if (!branchName || !RoomNo || !Floor || !RoomType || Capacity === null || Rate === null) {
        errors.push({ row, reason: "Missing required fields" });
        continue;
      }

      const existingRoom = await repo.findRoomByBranchAndNoRepo(tenantId, branchName, RoomNo);
      if (existingRoom) {
        duplicates.push({ row, reason: "Room already exists in this branch" });
        continue;
      }

      await repo.createRoomRepo({
        tenantId,
        branchName,
        Floor,
        RoomType,
        RoomNo,
        Capacity,
        Rate,
        Occupied: 0,
        users: [],
      });

      inserted++;
    } catch (err) {
      errors.push({ row, reason: err.message });
    }
  }

  return { inserted, duplicates, errors };
};


export const createRoom = async (user, body, tenantId) => {
  const { role } = user;

  let branchName;
  if (role === "Admin") {
    branchName = body.branchName;
  } else {
    branchName = user.branchName;
  }

  // 1. Extract Floor and category from body
  const { RoomType, Capacity, Rate, Floor, category } = body;
  const RoomNo = body.RoomNo?.trim();

  // 2. Updated validation to include Floor
  if (
    ![RoomType, RoomNo, Capacity, Rate, Floor].every(
      (field) => field !== undefined && field !== null && field.toString().trim() !== ""
    )
  ) {
    throw createError("All fields including Floor are required.", 400);
  }

  const existingRoom = await repo.findRoomByBranchAndNoRepo(tenantId, branchName, Floor, RoomNo);
  if (existingRoom) {
    throw createError("Room number already exists.", 400);
  }

  // 3. Add Floor and category to the data object sent to the repository
  const roomData = {
    tenantId,
    branchName,
    Floor,      // Added
    RoomType,
    RoomNo,
    Capacity,
    Occupied: 0,
    Rate,
    category: category || "Resident", // Added
  };

  const newRoom = await repo.createRoomRepo(roomData);
  return newRoom;
};


export const getAllRooms = async (user, body, query, tenantId) => {
  const { role } = user;

  const branchName =
    role === "Admin"
      ? body.branchName || query.branchName
      : user.branchName;

  const rooms = await repo.findRoomsByBranchRepo(tenantId, branchName);

  const processedRooms = rooms.map((room) => {
    const roomObj = room.toObject();

    // Occupied is already maintained by updateRoomOccupied()
    roomObj.Vacant = Math.max(0, roomObj.Capacity - roomObj.Occupied);

    // Expose rent for frontend
    roomObj.Rent = roomObj.Rate;

    return roomObj;
  });

  return {
    rooms: sortRooms(processedRooms),
    branchName,
  };
};
export const updateRoom = async (user, id, body, tenantId) => {
  const { role } = user;

  const branchName = role === "Admin" ? body.branchName : user.branchName;
  const RoomNo = body.RoomNo?.trim();

  if (!RoomNo) {
    throw createError("Room number cannot be empty", 400);
  }

  const oldRoom = await repo.findRoomByIdRepo(tenantId, id);
  if (!oldRoom) {
    throw createError("Room not found", 404);
  }

  const oldRoomNo = oldRoom.RoomNo;

  const duplicateRoom = await repo.findRoomByBranchAndNoRepo(tenantId, branchName, RoomNo);
  if (duplicateRoom && String(duplicateRoom._id) !== String(id)) {
    throw createError("Room number already exists in this branch.", 400);
  }

  const updateData = {
    ...body,
    RoomNo: body.RoomNo?.trim(),
    branchName: role === "Admin" ? body.branchName : user.branchName,
    Floor: body.Floor || oldRoom.Floor,
    category: body.category || oldRoom.category,
  };

  const updatedRoom = await repo.updateRoomByIdRepo(tenantId, id, updateData);

  if (oldRoomNo !== RoomNo) {
  await repo.updateRegisterRoomNoRepo(
    tenantId,
    branchName,
    oldRoomNo,
    RoomNo
  );

  await repo.updatePgRoomNoRepo(
    tenantId,
    branchName,
    oldRoomNo,
    RoomNo
  );
}

  return updatedRoom;
};

export const deleteRoom = async (id, tenantId) => {
  const roomToDelete = await repo.findRoomByIdRepo(tenantId, id);

  if (!roomToDelete) {
    throw createError("Room not found", 404);
  }

  if (roomToDelete.Occupied > 0) {
    throw createError("Cannot delete. Room still occupied.", 400);
  }

  await repo.deleteRoomByIdRepo(tenantId, id);
  return roomToDelete;
};


export const getRoomSummary = async (branchName, tenantId) => {
  const rooms = await repo.findRoomsForSummaryRepo(tenantId, branchName);

  let roomCount = rooms.length;
  let totalCapacity = 0;
  let totalOccupied = 0;
  let totalVacant = 0;
  let totalAC = 0;
  let totalNonAC = 0;

  for (const room of rooms) {
    const occupied = room.Occupied;
    const vacant = Math.max(0, room.Capacity - occupied);

    totalCapacity += room.Capacity;
    totalOccupied += occupied;
    totalVacant += vacant;

    if (room.RoomType === "AC") {
      totalAC += vacant;
    } else {
      totalNonAC += vacant;
    }
  }

  // Count active long-term residents
  const totalResidents = await register.countDocuments({
    tenantId,
    branchName,
    staying: true,
    isdeleted: false,
  });

  // Count active PG guests
  const totalPG = await PgData.countDocuments({
    tenantId,
    branchName,
    staying: true,
  });

  return {
    roomCount,
    totalCapacity,
    totalOccupied,
    totalVacant,

    totalResidents,
    totalPG,

    // ✅ Total bookings = Residents + PG
    totalBookings: totalResidents + totalPG,

    // (Same as occupied, included for convenience)
    totalOccupiedBookings: totalOccupied,

    totalAC,
    totalNonAC,
  };
};

export const permanentDeleteRoom = async (id, tenantId) => {
  const roomData = await repo.findRoomByIdRepo(tenantId, id);

  if (!roomData) {
    throw createError("Room not found", 404);
  }

  if (!roomData.isdeleted) {
    throw createError("Move to trash first before permanently deleting.", 400);
  }

  if (roomData.Occupied > 0) {
    throw createError("Cannot delete. Room is not empty.", 400);
  }

  
  await repo.deleteRoomByIdRepo(tenantId, id);
  return roomData;
};

export const permanentDeleteAllRooms = async (tenantId) => {
  const deletedRooms = await repo.findDeletedRoomsRepo({ tenantId, isdeleted: true });

  const roomsWithUsers = deletedRooms.filter((r) => r.Occupied > 0);
  if (roomsWithUsers.length > 0) {
    throw createError("Some rooms still have occupants. Cannot delete all.", 400);
  }

  const result = await repo.deleteManyRoomsRepo({ tenantId, isdeleted: true });
  return result.deletedCount;
};

export const recoverRoom = async (id, tenantId) => {
  const deletedRoom = await repo.findRoomByIdRepo(tenantId, id);

  if (!deletedRoom) {
    throw createError("Room not found", 404);
  }

  if (!deletedRoom.isdeleted) {
    throw createError("Room is already active", 400);
  }

  const existingRoom = await repo.findExistingActiveRoomRepo({
    tenantId,
    RoomNo: deletedRoom.RoomNo,
    branchName: deletedRoom.branchName,
    isdeleted: false,
  });

  if (existingRoom) {
    throw createError(
      `Cannot recover. Room '${deletedRoom.RoomNo}' already exists in ${deletedRoom.branchName}.`,
      400
    );
  }

  deletedRoom.isdeleted = false;
  deletedRoom.deletedinfo = deletedRoom.deletedinfo || {};
  deletedRoom.deletedinfo.deleteddate = null;
  deletedRoom.deletedinfo.deleteby = null;

  await repo.saveRoomRepo(deletedRoom);
  return deletedRoom;
};

export const getDeletedRooms = async (user, body, query, tenantId) => {
  const { role } = user;
  let branchName;

  if (role === "Warden") {
    branchName = user.branchName;
  } else {
    branchName = body.branchName || query.branchName;
  }

  const branchFilter = buildBranchFilter(user, branchName);

  const finalFilter = {
    tenantId,
    ...branchFilter,
    isdeleted: true,
  };

  const deletedRooms = await repo.findDeletedRoomsRepo(finalFilter);
  return deletedRooms;
};
