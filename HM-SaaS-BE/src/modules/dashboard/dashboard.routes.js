import express from "express";
import protect from "../../utils/authMiddleware.js";
import dashboardController from "./dashboard.controller.js";
import { fixDeletedFields } from "../../utils/updatemany.js";
import { allaccess } from "../../utils/role.js";

const dashRouter = express.Router();

dashRouter.get("/", protect, allaccess, dashboardController.getDashboard);
dashRouter.get("/updatedata", protect, allaccess, fixDeletedFields);

export default dashRouter;
