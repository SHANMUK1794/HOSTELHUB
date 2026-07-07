import Notification from "./notification.model.js";

export const upsertNotification = async (filter, update) => {
  return await Notification.updateOne(filter, update, { upsert: true });
};

export const findNotifications = async (
  filter,
  sort = { createdAt: -1 },
  limit = null,
) => {
  const query = Notification.find(filter).sort(sort);
  if (limit) query.limit(limit);
  return await query;
};

export const updateById = async (filter, updateData) => {
  return await Notification.findOneAndUpdate(filter, updateData, { new: true });
};

export const updateMany = async (filter, updateData) => {
  return await Notification.updateMany(filter, updateData);
};
