import * as employeeService from "./employee.service.js";
import * as employeeRepo from "./employee.repository.js";
import { buildBranchFilter } from "../../utils/filter.js";

export const createEmployee = async (req, res) => {
  try {
    const { branchName, Name, EmpNo, DOJ, DOB, Salary, Mobile } = req.body;
    if (!branchName || !Name || !EmpNo || !DOJ || !DOB || !Salary || !Mobile) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const data = await employeeService.createEmployeeService(req.body, req.tenantId);
    res
      .status(201)
      .json({ success: true, message: "Employee created successfully.", data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const { role, branchName: userBranch } = req.user;
    const branchName = role === "Admin" ? req.query.branchName : userBranch;
    const { sort } = req.query;

    if (!branchName)
      return res.status(400).json({ message: "branchName is required." });

    const employees =
      await employeeRepo.findActiveEmployeesByBranchRepo({ tenantId: req.tenantId, branchName });

    if (!employees || employees.length === 0) {
      return res
        .status(200)
        .json({ message: `No employees found for branch: ${branchName}` });
    }

    res.status(200).json({
      success: true,
      message: `Employees fetched successfully for branch: ${branchName}`,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const data = await employeeService.updateEmployeeService(
      req.params.id,
      req.body,
      req.tenantId
    );
    res
      .status(200)
      .json({ success: true, message: "Updated successfully.", data });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    await employeeService.softDeleteEmployeeService(
      req.params.id,
      req.user?._id,
      req.tenantId
    );
    res
      .status(200)
      .json({ success: true, message: "Moved to trash successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDeletedEmployees = async (req, res) => {
  try {
    const branchName =
      req.user.role === "Warden"
        ? req.user.branchName
        : req.body.branchName || req.query.branchName;
    const branchFilter = buildBranchFilter(req.user, branchName);
    const deleted = await employeeRepo.findDeletedEmployeesRepo({
      tenantId: req.tenantId,
      ...branchFilter,
      isdeleted: true,
    });
    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const recoverEmployee = async (req, res) => {
  try {
    const data = await employeeService.recoverEmployeeService(req.params.id, req.tenantId);
    res
      .status(200)
      .json({ success: true, message: "Recovered successfully", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const permanentDeleteEmployee = async (req, res) => {
  try {
    const emp = await employeeRepo.findEmployeeByIdRepo({ _id: req.params.id, tenantId: req.tenantId });
    if (!emp?.isdeleted)
      return res.status(400).json({ message: "Move to trash first" });
    await employeeRepo.deleteEmployeeByIdRepo({ _id: req.params.id, tenantId: req.tenantId });
    res.status(200).json({ success: true, message: "Permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

export const permanentDeleteAllEmployees = async (req, res) => {
  try {
    const result = await employeeRepo.deleteManyEmployeesRepo({
      tenantId: req.tenantId,
      isdeleted: true,
    });
    res
      .status(200)
      .json({
        success: true,
        message: `Deleted ${result.deletedCount} permanently`,
      });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};
