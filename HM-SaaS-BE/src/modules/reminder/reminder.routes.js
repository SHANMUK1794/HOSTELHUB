import express from "express";
import protect from "../../utils/authMiddleware.js";
import { getBirthDay, sendcustommessage } from "./reminder.controller.js";
import { adminWarden } from "../../utils/role.js";

const reminderRouter = express.Router();

reminderRouter.get("/getbirthday", protect, getBirthDay);
reminderRouter.post("/sendmessage", protect, sendcustommessage);

export default reminderRouter;
