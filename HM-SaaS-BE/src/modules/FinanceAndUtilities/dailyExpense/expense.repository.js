import DailyExpense from "./expense.model.js";

export const create = async (data) => await DailyExpense.create(data);

export const find = async (filter) => await DailyExpense.find(filter);

export const findById = async (filter) => await DailyExpense.findOne(filter);

export const findByIdAndUpdate = async (filter, data) => 
  await DailyExpense.findOneAndUpdate(filter, { $set: data }, { new: true });

export const findByIdAndDelete = async (filter) => 
  await DailyExpense.findOneAndDelete(filter);

export const aggregate = async (pipeline) => await DailyExpense.aggregate(pipeline);