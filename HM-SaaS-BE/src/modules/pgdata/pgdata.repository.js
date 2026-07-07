import PgData from "./pgdata.model.js";

export const create = async (data) => {
  return await PgData.create(data);
};

export const findById = async (filter) => {
  return await PgData.findOne(filter);
};

export const findOne = async (query) => {
  return await PgData.findOne(query);
};

export const findMany = async (query) => {
  return await PgData.find(query).lean();
};

export const updateById = async (filter, data) => {
  return await PgData.findOneAndUpdate(
    filter,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteById = async (filter) => {
  return await PgData.findOneAndDelete(filter);
};

export const count = async (query) => {
  return await PgData.countDocuments(query);
};