import * as fundRepository from "./fund.repository.js";
import { buildCombinedFilter } from "../../../utils/filter.js";

export const createFund = async (body, userContext, tenantId) => {
  const { role } = userContext;
  const branchName =
    role === "Admin" ? body.branchName : userContext.branchName;

  const { date, description, amount, paymentMethod, receiverName, senderName } =
    body;

  if (
    !date ||
    !description ||
    !amount ||
    !paymentMethod ||
    !receiverName ||
    !branchName ||
    !senderName
  ) {
    throw new Error("Required fields are missing");
  }

  return await fundRepository.create({
    date,
    description,
    amount: Number(amount),
    branchName,
    paymentMethod,
    receiverName,
    senderName,
    tenantId,
  });
};

export const getFunds = async (userContext, query, tenantId) => {
  let filter = buildCombinedFilter(userContext, query);
  
  // 👉 FIXED: Excludes soft-deleted funds from dashboard lists and total math calculations
  filter.isdeleted = { $ne: true };
  filter.tenantId = tenantId;

  const data = await fundRepository.find(filter);
  const totalAmount = await fundRepository.aggregateTotal(filter);

  return { data, totalAmount, count: data.length };
};

export const updateFund = async (id, body, tenantId) => {
  const fund = await fundRepository.findById({ _id: id, tenantId });
  if (!fund) throw new Error("Incoming fund not found");

  const fields = [
    "date",
    "description",
    "paymentMethod",
    "receiverName",
    "senderName",
  ];
  fields.forEach((field) => {
    if (body[field] !== undefined) fund[field] = body[field];
  });

  if (body.amount !== undefined) fund.amount = Number(body.amount);

  return await fund.save();
};

// 👉 FIXED: CHANGED FROM HARD DELETE TO SAFE SOFT DELETE
export const deleteFund = async (id, userContext, tenantId) => {
  const fund = await fundRepository.findById({ _id: id, tenantId });
  if (!fund) throw new Error("Incoming fund not found");
  
  fund.isdeleted = true;
  fund.deletedinfo = {
    deleteddate: new Date(),
    deleteby: userContext?._id || null,
    module: "incomingFund", // Matches your backend service lookup configuration exactly
  };

  return await fund.save();
};