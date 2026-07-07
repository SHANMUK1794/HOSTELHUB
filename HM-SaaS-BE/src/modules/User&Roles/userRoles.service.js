import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import * as repo from "./userRoles.repository.js"; 

const createError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim() !== "";



export const createEmployee = async (body, tenantId) => {
  const {
    staffName,
    role,
    username,
    password,
    branchName,
    phoneNo, // 🛡️ Ensure phoneNo is grabbed from body
    admin_id, // 🛡️ Received from the secure controller
  } = body;

  if (!admin_id) {
    throw createError("Admin authentication is required.", 401);
  }

  if (
    ![staffName, role, branchName].every(
      (field) => field && field.trim && field.trim() !== "",
    )
  ) {
    throw createError("All fields are required and must not be empty.", 400);
  }

  let existingUser;

  if (role === "Other Employees") {
    existingUser = await repo.findUserByBranchAndPhoneRepo({ tenantId, branchName });
  } else {
    if (!username || !password) {
      throw createError(
        "Username and password are required for this role.",
        400
      );
    }

    if (role === "Admin") {
      existingUser = await repo.findUserByUsernameRepo({ tenantId, username });
    } else {
      existingUser = await repo.findUserByUsernameRepo({ tenantId, branchName, username });
    }
  }

  if (existingUser) {
    throw createError("Username or phone number is already taken.", 400);
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  // 🛡️ Ensure admin_id, tenantId, and phoneNo is passed to the database creation
  const newEmployee = await repo.createUserRepo({
    tenantId,
    staffName,
    role,
    username: username || null,
    phoneNo: phoneNo || null,
    password: hashedPassword,
    branchName: branchName, // Fix: Use the actual branch Name directly
    admin_id: admin_id, 
  });

  return newEmployee;
};

export const getAllEmployees = async (query, tenantId) => {
  const { branchName, admin_id } = query;
  
  if (!branchName) return { branchMissing: true };
  if (!admin_id) throw createError("Admin authentication is required.", 401);

  // 🛡️ Pass admin_id and tenantId to the repository to enforce Tenant Isolation
  const employees = await repo.findEmployeesByBranchRepo({ 
    tenantId,
    branchName: branchName, 
    admin_id: admin_id 
  });
  
  return { employees };
};

export const updateEmployee = async (id, body, tenantId) => {
  const {
    staffName,
    role,
    shift,
    username,
    phoneNo,
    password,
    branchName,
    staying,
    vacatedate,
    admin_id, // 🛡️ Received from the secure controller
  } = body;

  if (!admin_id) throw createError("Admin authentication is required.", 401);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid employee ID format.", 400);
  }

  if (
    ![staffName, role, username, branchName].every(
      (field) => isNonEmptyString(field)
    )
  ) {
    throw createError(
      "Staff name, role, username, and branch name are required.",
      400
    );
  }

  const existingEmployee = await repo.findUserByIdRepo({ _id: id, tenantId });
  if (!existingEmployee) {
    throw createError("Employee not found.", 404);
  }

  // 🛡️ STRICT ISOLATION CHECK: Block cross-tenant edits
  if (String(existingEmployee.admin_id) !== String(admin_id)) {
    throw createError("Unauthorized: This employee belongs to another admin workspace.", 403);
  }

  if (username !== existingEmployee.username) {
    const usernameTaken = await repo.findUserByUsernameRepo({
      tenantId,
      branchName,
      username,
    });

    if (usernameTaken) {
      throw createError("Username is already taken.", 400);
    }
  }

  const isSameData =
    existingEmployee.staffName === staffName &&
    existingEmployee.role === role &&
    existingEmployee.shift === shift &&
    existingEmployee.username === username &&
    existingEmployee.phoneNo === phoneNo &&
    existingEmployee.branchName === branchName &&
    (!password ||
      (existingEmployee.password &&
        (await bcrypt.compare(password, existingEmployee.password))));

  if (isSameData) {
    throw createError(
      "No changes detected. Please modify some data to update.",
      400
    );
  }

  if (staying === false && !vacatedate) {
    throw createError("Vacate date is required if user is not staying.", 400);
  }

  const updateData = {
    staffName,
    role,
    shift,
    username,
    phoneNo,
    branchName,
    staying,
    vacatedate: staying ? null : vacatedate,
  };

  if (password && password.trim() !== "") {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedEmployee = await repo.updateUserByIdRepo({ _id: id, tenantId }, updateData);
  return updatedEmployee;
};

export const deleteEmployee = async (id, employeeId, tenantId) => {
  if (!id) {
    throw createError("Employee ID is required.", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid employee ID format.", 400);
  }

  const employee = await repo.findUserByIdRepo({ _id: id, tenantId });

  if (!employee) {
    throw createError("Employee not found.", 404);
  }

  if (employee.isdeleted === true) {
    throw createError("Employee is already deleted.", 400);
  }

  employee.isdeleted = true;
  employee.deletedinfo = {
    deleteddate: new Date(),
    deleteby: employeeId,
    module: "user",
  };

  await employee.save();

  return employee;
};