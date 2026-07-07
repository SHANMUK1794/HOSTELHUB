import user from "./auth.model.js";

export const findUserByEmailRepo = (email) => {
  return user.findOne({ email });
};

export const findUserByIdRepo = (userId) => {
  return user.findById(userId);
};

export const saveUserRepo = (userDoc) => {
  return userDoc.save();
};

export const createUserRepo = (data) => {
  return user.create(data);
};