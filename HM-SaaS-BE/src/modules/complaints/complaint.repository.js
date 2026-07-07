import complaint from "./complaint.model.js";

export const create = async (data) => await complaint.create(data);

export const findById = async (filter) => await complaint.findOne(filter);

export const find = async (filter) => await complaint.find(filter);

export const findOne = async (filter) => await complaint.findOne(filter);

export const updateById = async (filter, updateData) => {
  return await complaint.findOneAndUpdate(filter, { $set: updateData }, { new: true });
};

export const deleteById = async (filter) => await complaint.findOneAndDelete(filter);

export const deleteMany = async (filter) => await complaint.deleteMany(filter);

export const saveDocument = async (doc) => await doc.save();