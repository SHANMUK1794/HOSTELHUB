import Tenant from "./tenant.model.js";

/**
 * Tenant Repository — Data access layer for tenant CRUD.
 */

export const createTenantRepo = async (data) => {
  return await Tenant.create(data);
};

export const findTenantByIdRepo = async (id) => {
  return await Tenant.findById(id);
};

export const findTenantByOwnerRepo = async (ownerId) => {
  return await Tenant.findOne({ owner: ownerId });
};

export const updateTenantRepo = async (id, data) => {
  return await Tenant.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};
