import express from "express";
import protect from "../../utils/authMiddleware.js";
import { adminOnly, allaccess } from "../../utils/role.js";
import {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
} from "./userRoles.controller.js";

const employeeRouter = express.Router();

employeeRouter.use(protect);

employeeRouter.post("/createemployee", adminOnly, createEmployee);
employeeRouter.put("/updateemployee/:id", adminOnly, updateEmployee);
employeeRouter.delete("/deleteemployee/:id", adminOnly, deleteEmployee);
employeeRouter.get("/getallemployees", allaccess, getAllEmployees);

export default employeeRouter;


