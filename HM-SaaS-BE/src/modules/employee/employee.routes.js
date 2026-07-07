import express from "express";
import protect from "../../utils/authMiddleware.js";
import { adminOnly } from "../../utils/role.js";
import * as employeeCtrl from "./employee.controller.js";

const employeeRouter = express.Router();

employeeRouter.use(protect);

// Standard CRUD
employeeRouter.post("/createemployee", adminOnly, employeeCtrl.createEmployee);
employeeRouter.put(
  "/updateemployee/:id",
  adminOnly,
  employeeCtrl.updateEmployee,
);
employeeRouter.delete(
  "/deleteemployee/:id",
  adminOnly,
  employeeCtrl.deleteEmployee,
);
employeeRouter.get("/getallemployees", adminOnly, employeeCtrl.getEmployees);

// Trash Management
employeeRouter.get(
  "/getDeletedEmployees",
  adminOnly,
  employeeCtrl.getDeletedEmployees,
);
employeeRouter.get(
  "/recoverEmployee/:id",
  adminOnly,
  employeeCtrl.recoverEmployee,
);
employeeRouter.delete(
  "/permanentDeleteEmployee/:id",
  adminOnly,
  employeeCtrl.permanentDeleteEmployee,
);
employeeRouter.delete(
  "/permanentDeleteAllEmployees",
  adminOnly,
  employeeCtrl.permanentDeleteAllEmployees,
);

export default employeeRouter;
