import IncomingFund from "./fund.model.js";

export const create = async (data) => {
  return await IncomingFund.create(data);
};

export const findById = async (filter) => {
  return await IncomingFund.findOne(filter);
};

export const find = async (filter) => {
  return await IncomingFund.find(filter).sort({ date: -1 });
};

export const aggregateTotal = async (filter) => {
  const result = await IncomingFund.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  return result.length > 0 ? result[0].totalAmount : 0;
};