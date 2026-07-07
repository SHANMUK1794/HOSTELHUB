import achievementModel from "./achievement.model.js";

export const create = async (data) => {
  const achievement = new achievementModel(data);
  return await achievement.save();
};

export const findById = async (filter) => {
  return await achievementModel.findOne(filter);
};

export const find = async (filter, sort = { createdAt: -1 }) => {
  return await achievementModel.find(filter).sort(sort);
};

export const findByIdAndDelete = async (filter) => {
  return await achievementModel.findOneAndDelete(filter);
};

export const deleteMany = async (filter) => {
  return await achievementModel.deleteMany(filter);
};

export const save = async (record) => {
  return await record.save();
};
