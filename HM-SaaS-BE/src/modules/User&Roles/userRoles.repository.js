import user from "./userRoles.model.js";

export const findUserByIdRepo = (filter) => {
  return user.findOne(filter);
};

// Allows passing an object like { username: "...", admin_id: "..." }
export const findUserByUsernameRepo = (filter) => {
  return user.findOne(filter);
};

// Updated to accept an object so we can pass admin_id if needed
export const findUserByBranchAndPhoneRepo = (filter) => {
  return user.findOne(filter);
};

// 🛡️ THE CRITICAL FIX: Accepts the { branchName, admin_id } object from the service
export const findEmployeesByBranchRepo = (filter) => {
  // Spreads the filter to include admin_id, and ensures we don't fetch deleted users
  return user.find({ ...filter, isdeleted: false }, "-password");
};

export const createUserRepo = (data) => {
  // data now securely contains the admin_id from the service
  return user.create(data);
};

export const updateUserByIdRepo = (filter, updateData) => {
  return user.findOneAndUpdate(filter, updateData, {
    new: true,
    runValidators: true,
  });
};