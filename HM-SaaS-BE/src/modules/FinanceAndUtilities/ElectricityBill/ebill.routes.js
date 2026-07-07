import express from "express";
import Controller from "./ebill.controller.js";
import { adminWarden } from "../../../utils/role.js";
import protect from "../../../utils/authMiddleware.js";

const billrouter = express.Router();

billrouter.use(protect);

billrouter.post("/addbill", adminWarden, Controller.addBill);
billrouter.get("/allbills", adminWarden, Controller.getAllBills);
billrouter.get("/getdata", adminWarden, Controller.getRoomData);
billrouter.put("/updatebill/:id", adminWarden, Controller.updateBill);
billrouter.delete("/deletebill/:id", adminWarden, Controller.deleteBill);

billrouter.post("/sendreminder", adminWarden, Controller.sendManualReminder);
billrouter.post("/sendmesg", adminWarden, Controller.sendGroupMessage);

// export/summary handled via getAllBills logic
billrouter.get("/export", adminWarden, Controller.getAllBills);

export default billrouter;
