import express from "express";
import protect from "../../../utils/authMiddleware.js";
import Controller from "./roomRent.controller.js";
import { adminWarden } from "../../../utils/role.js";

const roomrentRouter = express.Router();

roomrentRouter.use(protect);

// match: /api/payement/v1/getusersroomrent
roomrentRouter.get("/getusersroomrent", adminWarden, Controller.getalluserRent);

// match: /api/payement/v1/createroomrent
roomrentRouter.post("/createroomrent", adminWarden, Controller.createRoomRent);

// match: /api/payement/v1/updateroomrent/:id
roomrentRouter.put(
  "/updateroomrent/:id",
  adminWarden,
  Controller.updateRoomRent,
);

// 👉 NEW: Route for processing installment payments & saving history
// match: /api/payement/v1/installment/:id
roomrentRouter.put(
  "/installment/:id",
  adminWarden,
  Controller.addInstallment
);

// match: /api/payement/v1/deleteroomrent/:id
roomrentRouter.delete(
  "/deleteroomrent/:id",
  adminWarden,
  Controller.deleteRoomRent,
);

roomrentRouter.get("/room-rent/deposit/export", Controller.exportExcel);

export default roomrentRouter;