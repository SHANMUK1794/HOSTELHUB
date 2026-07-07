import registerModel from "./register.model.js";

export const create = async (data) => {
  return await registerModel.create(data);
};

export const findById = async (id) => {
  return await registerModel.findById(id);
};

export const findOne = async (filter) => {
  return await registerModel.findOne(filter);
};

export const find = async (filter, sort = { Registerdate: -1 }) => {
  return await registerModel.find(filter).sort(sort);
};

export const count = async (filter) => {
  return await registerModel.countDocuments(filter);
};

export const findByIdAndUpdate = async (
  id,
  data,
  options = { new: true, runValidators: true }
) => {
  return await registerModel.findByIdAndUpdate(id, data, options);
};

export const updateOne = async (
  filter,
  data,
  options = { runValidators: true }
) => {
  return await registerModel.updateOne(filter, data, options);
};

export const deleteMany = async (filter) => {
  return await registerModel.deleteMany(filter);
};

export const findByIdAndDelete = async (id) => {
  return await registerModel.findByIdAndDelete(id);
};

export const save = async (record) => {
  return await record.save();
};