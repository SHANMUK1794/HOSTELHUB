import user from "./auth.model.js";

// export const findUserByUsernameRepo = (username) => {
//   return user.findOne({ username });
// };

export const findUserByEmailRepo = (email) => {
  return user.findOne({ email });
};

export const findUserByIdRepo = (userId) => {
  return user.findById(userId);
};

export const saveUserRepo = (user) => {
  return user.save();
};