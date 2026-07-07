import {
  createCylinderRepo,
  getAllCylindersRepo,
  getCylinderByIdRepo,
  updateCylinderRepo,
  deleteCylinderRepo,
} from "./cylinder.repository.js";

import { buildDateRangeFilter } from "../../../utils/filter.js";

export const createCylinderService = async (body) => {
  const {
    date,
    deliverydate,
    installeddate,
    emptydate,
    capacity,
    quantity,
    amount,
    usage,
  } = body;

  if (!date || !deliverydate || !capacity || !quantity || !amount) {
    throw new Error(
      "date, deliverydate, capacity, quantity, amount are required."
    );
  }

  return await createCylinderRepo({
    date,
    deliverydate,
    installeddate: installeddate || null,
    emptydate: emptydate || null,
    capacity,
    quantity,
    amount,
    usage: usage || null,
  });
};

export const getAllCylindersService = async (query) => {
  const { month, year } = query;
  const filter = buildDateRangeFilter(month, year);

  const cylinders = await getAllCylindersRepo(filter);

  const totalAmount = cylinders.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  return {
    count: cylinders.length,
    totalAmount,
    data: cylinders,
  };
};

export const updateCylinderService = async (id, body) => {
  const existing = await getCylinderByIdRepo(id);

  if (!existing) {
    throw new Error("Cylinder not found.");
  }

  const {
    date,
    deliverydate,
    installeddate,
    emptydate,
    capacity,
    quantity,
    amount,
    usage,
  } = body;

  if (!date || !deliverydate || !capacity || !quantity || !amount) {
    throw new Error(
      "date, deliverydate, capacity, quantity, amount are required."
    );
  }

  const updateData = {
    date,
    deliverydate,
    installeddate: installeddate || null,
    emptydate: emptydate || null,
    capacity,
    quantity,
    amount,
    usage: usage || null,
  };

  return await updateCylinderRepo(id, updateData);
};

export const deleteCylinderService = async (id, userId) => {
  const deleted = await deleteCylinderRepo(id, userId);

  if (!deleted) {
    throw new Error("Cylinder not found.");
  }

  return deleted;
};