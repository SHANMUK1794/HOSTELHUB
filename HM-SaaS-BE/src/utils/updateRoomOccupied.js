import Room from "../modules/roomAndResidents/Room&Residence.model.js";
import Register from "../modules/register/register.model.js";
import PgData from "../modules/pgdata/pgdata.model.js";

export const updateRoomOccupied = async (
  tenantId,
  branchName,
  RoomNo
) => {
  if (!RoomNo) return;

  const room = await Room.findOne({
    tenantId,
    branchName,
    RoomNo,
  });

  if (!room) return;

  const residentCount = await Register.countDocuments({
    tenantId,
    branchName,
    RoomNo,
    staying: true,
    isdeleted: false,
  });

  const pgCount = await PgData.countDocuments({
    tenantId,
    branchName,
    RoomNo,
    staying: true,
  });

  room.Occupied = residentCount + pgCount;

  await room.save();

  return room.Occupied;
};