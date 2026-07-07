import * as employeeRepo from "./employee.repository.js";

// Helper for age calculation
const calculateAge = (dob) => {
  const dobDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dobDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const createEmployeeService = async (data, tenantId) => {
  const existingEmp = await employeeRepo.findEmployeeByMobileRepo({ tenantId, branchName: data.branchName, Mobile: data.Mobile });
  if (existingEmp) throw new Error("Employee number already exists.");

  const Age = calculateAge(data.DOB);
  const PerDay = Number((data.Salary / 30).toFixed(2));

  return await employeeRepo.createEmployeeRepo({
    ...data,
    tenantId,
    Age,
    PerDay,
    Advance: 0,
  });
};

export const updateEmployeeService = async (id, updates, tenantId) => {
  const employee = await employeeRepo.findEmployeeByIdRepo({ _id: id, tenantId });
  if (!employee) throw new Error("Employee not found.");

  // Apply updates
  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) employee[key] = updates[key];
  });

  if (updates.DOB) employee.Age = calculateAge(updates.DOB);
  if (updates.Salary !== undefined) {
    employee.PerDay = parseFloat((updates.Salary / 30).toFixed(2));
  }

  return await employeeRepo.saveEmployeeRepo(employee);
};

export const softDeleteEmployeeService = async (id, userId, tenantId) => {
  const emp = await employeeRepo.findEmployeeByIdRepo({ _id: id, tenantId });
  if (!emp) throw new Error("Employee not found.");
  if (emp.Advance > 0)
    throw new Error(
      `Cannot delete ${emp.Name}. Advance balance: ₹${emp.Advance}`,
    );
  if (emp.isdeleted) throw new Error("Employee already moved to trash");

  emp.isdeleted = true;
  emp.deletedinfo = {
    deleteddate: new Date(),
    deleteby: userId,
    module: "employee",
  };

  return await employeeRepo.saveEmployeeRepo(emp);
};

export const recoverEmployeeService = async (id, tenantId) => {
  const emp = await employeeRepo.findEmployeeByIdRepo({ _id: id, tenantId });
  if (!emp) throw new Error("Employee not found");
  if (!emp.isdeleted) throw new Error("Employee is already active");

  emp.isdeleted = false;
  emp.deletedinfo.deleteddate = null;
  emp.deletedinfo.deleteby = null;

  return await employeeRepo.saveEmployeeRepo(emp);
};
