
// export const findByIdAndDelete = async (id) =>
//   await Payroll.findByIdAndDelete(id);

import Payroll from "./payroll.model.js";

export const create = async (data) => await Payroll.create(data);
export const findOne = async (filter) => await Payroll.findOne(filter);
export const find = async (filter) => await Payroll.find(filter).lean();
export const findById = async (filter) => await Payroll.findOne(filter);
export const findByIdAndUpdate = async (filter, data) =>
  await Payroll.findOneAndUpdate(filter, data, { new: true });