import Subscription from "./subscription.model.js";

export const findOne = async (filter) => {
  return await Subscription.findOne(filter);
};

export const findById = async (id) => {
  return await Subscription.findById(id);
};

export const findByOrganizationId = async (organizationId) => {
  return await Subscription.findOne({ organizationId });
};

export const create = async (data) => {
  return await Subscription.create(data);
};

export const save = async (subscriptionDoc) => {
  return await subscriptionDoc.save();
};

export const findOneAndUpdate = async (
  filter,
  data,
  options = { new: true, runValidators: true }
) => {
  return await Subscription.findOneAndUpdate(filter, data, options);
};

export const updateOne = async (
  filter,
  data,
  options = { runValidators: true }
) => {
  return await Subscription.updateOne(filter, data, options);
};

export const find = async (filter, sort = { createdAt: -1 }) => {
  return await Subscription.find(filter).sort(sort);
};

export const count = async (filter) => {
  return await Subscription.countDocuments(filter);
};

export const deleteOne = async (filter) => {
  return await Subscription.deleteOne(filter);
};
