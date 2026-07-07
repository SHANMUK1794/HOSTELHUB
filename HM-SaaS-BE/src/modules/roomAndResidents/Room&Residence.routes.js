import express from "express";
import protect from "../../utils/authMiddleware.js";
import { adminWarden } from "../../utils/role.js";

import {
  bulkImportRooms,
  createRoom,
  deleteRoom,
  getallRoom,
  updateRoom,
  permanentDeleteAllRooms,
  permanentDeleteRoom,
  getDeletedRooms,
  recoverRoom,
} from "./Room&Residence.controller.js";

const roomRouter = express.Router();

roomRouter.get("/getrooms", protect, adminWarden, getallRoom);
roomRouter.post("/createRoom", protect, adminWarden, createRoom);
roomRouter.put("/updateRoom/:id", protect, adminWarden, updateRoom);
roomRouter.delete("/deleteRoom/:id", protect, adminWarden, deleteRoom);

roomRouter.post("/bulk", protect, adminWarden, bulkImportRooms);

roomRouter.delete("/permanent/:id", protect, permanentDeleteRoom);
roomRouter.delete("/permanent/all", protect, permanentDeleteAllRooms);

roomRouter.get("/getDeletedRooms", protect, adminWarden, getDeletedRooms);
roomRouter.get("/recoverRoom/:id", protect, adminWarden, recoverRoom);

export default roomRouter;
