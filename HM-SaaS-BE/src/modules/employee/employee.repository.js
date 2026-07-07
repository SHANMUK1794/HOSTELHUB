import Employee from "./employee.model.js";

export const createEmployeeRepo = (data) => {
  return Employee.create(data);
};

export const findEmployeeByMobileRepo = (filter) => {
  return Employee.findOne(filter);
};

export const findEmployeeByIdRepo = (filter) => {
  return Employee.findOne(filter);
};

export const findActiveEmployeesByBranchRepo = (filter) => {
  return Employee.find({ ...filter, isdeleted: false }).sort({ DOJ: -1 });
};

export const saveEmployeeRepo = (employee) => {
  return employee.save();
};

export const updateEmployeeByIdRepo = (filter, updateData) => {
  return Employee.findOneAndUpdate(filter, updateData, {
    new: true,
    runValidators: true,
  });
};

export const findDeletedEmployeesRepo = (filter) => {
  return Employee.find(filter);
};

export const deleteEmployeeByIdRepo = (filter) => {
  return Employee.findOneAndDelete(filter);
};

export const deleteManyEmployeesRepo = (filter) => {
  return Employee.deleteMany(filter);
};
