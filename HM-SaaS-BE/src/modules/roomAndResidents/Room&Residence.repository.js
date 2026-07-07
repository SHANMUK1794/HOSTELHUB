import Room from "./Room&Residence.model.js";
import register from "../register/register.model.js";
import pgdata from "../pgdata/pgdata.model.js";

export const createRoomRepo = (data) => {
  return Room.create(data);
};

export const findRoomByBranchAndNoRepo = (
  tenantId,
  branchName,
  Floor,
  RoomNo
) => {
  return Room.findOne({
    tenantId,
    branchName,
    Floor,
    RoomNo,
  });
};

export const findRoomByIdRepo = (tenantId, id) => {
  return Room.findOne({ tenantId, _id: id });
};

export const findRoomsByBranchRepo = (tenantId, branchName) => {
  return Room.find({ tenantId, branchName, isdeleted: false, }).populate({
    path: "users",
    select: "Name MobileNo AddharNumber PermanentAddress FoodType",
  });
};

export const findDeletedRoomsRepo = (filter) => {
  return Room.find(filter);
};

export const findExistingActiveRoomRepo = (filter) => {
  return Room.findOne(filter);
};

export const updateRoomByIdRepo = (tenantId, id, updateData) => {
  return Room.findOneAndUpdate({ tenantId, _id: id }, updateData, { new: true });
};

export const deleteRoomByIdRepo = (tenantId, id) => {
  return Room.findOneAndDelete({ tenantId, _id: id });
};

export const deleteManyRoomsRepo = (filter) => {
  return Room.deleteMany(filter);
};

export const saveRoomRepo = (room) => {
  return room.save();
};

export const updateRegisterRoomNoRepo = (tenantId, branchName, oldRoomNo, newRoomNo) => {
  return register.updateMany(
    { tenantId, RoomNo: oldRoomNo, branchName },
    { $set: { RoomNo: newRoomNo } }
  );
};

export const countBookingsRepo = (tenantId, branchName) => {
  return register.countDocuments({
    tenantId,
    branchName,
    staying: true,
    isdeleted: false,
  });
};

export const countPgRepo = (tenantId, branchName) => {
  return pgdata.countDocuments({
    tenantId,
    branchName,
    staying: true,
  });
};

export const findRoomsForSummaryRepo = (tenantId, branchName) => {
  return Room.find({ tenantId, branchName, isdeleted: false });
};