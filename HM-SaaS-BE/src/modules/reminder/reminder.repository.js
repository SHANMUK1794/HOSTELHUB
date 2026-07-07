import register from "../register/register.model.js";
import employee from "../employee/employee.model.js";
import user from "../userController/auth.model.js";

export const getStudents = async (query) => {
  return await register.find(query);
};

export const getEmployees = async (query) => {
  return await employee.find(query);
};

export const getUsers = async (query) => {
  return await user.find(query);
};
