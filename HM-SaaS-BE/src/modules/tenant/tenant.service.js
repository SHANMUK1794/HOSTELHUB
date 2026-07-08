import * as tenantRepo from "./tenant.repository.js";
import userModel from "../userController/auth.model.js";
import Settings from "../settings/settings.model.js"; // 👉 Import the Settings model

/**
 * Tenant Service — Business logic for tenant operations.
 */

const createError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * Create a new tenant (Hostel/PG) for a user.
 * Called after signup when user has no tenantId yet.
 */
export const createTenant = async (userId, body) => {
  const { name, branches } = body;

  if (!name || !name.trim()) {
    throw createError("Organization/Hostel name is required.", 400);
  }

  if (!branches || !Array.isArray(branches) || branches.length === 0) {
    throw createError("At least one branch name is required.", 400);
  }

  // Sanitize branch names
  const sanitizedBranches = branches
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  if (sanitizedBranches.length === 0) {
    throw createError("At least one valid branch name is required.", 400);
  }

  // Check if user already has a tenant
  const existingTenant = await tenantRepo.findTenantByOwnerRepo(userId);
  if (existingTenant) {
    throw createError("You already have an organization. Cannot create another.", 400);
  }

  // 1. Create the tenant
  const tenant = await tenantRepo.createTenantRepo({
    name: name.trim(),
    owner: userId,
    branches: sanitizedBranches,
  });

  // 👉 2. NEW: AUTOMATIC TENANT PROVISIONING
  // Seed the database with this tenant's isolated settings document.
  // Because we set defaults in the schema, this automatically provisions 
  // their Centralized WhatsApp configuration!
  await Settings.create({
    tenantId: tenant._id,
    branchName: sanitizedBranches[0] || "Common",
  });

  // 3. Update the user's tenantId
  await userModel.findByIdAndUpdate(userId, { tenantId: tenant._id });

  return tenant;
};

/**
 * Get the current user's tenant information.
 */
export const getMyTenant = async (tenantId) => {
  if (!tenantId) {
    throw createError("No tenant associated with this account.", 404);
  }

  const tenant = await tenantRepo.findTenantByIdRepo(tenantId);
  if (!tenant) {
    throw createError("Tenant not found.", 404);
  }

  return tenant;
};

/**
 * Update tenant details (name, branches).
 * Only the tenant owner (admin) can do this.
 */
export const updateTenant = async (tenantId, userId, body) => {
  const tenant = await tenantRepo.findTenantByIdRepo(tenantId);

  if (!tenant) {
    throw createError("Tenant not found.", 404);
  }

  // Verify ownership
  if (String(tenant.owner) !== String(userId)) {
    throw createError("Only the organization owner can update tenant details.", 403);
  }

  const updateData = {};

  if (body.name && body.name.trim()) {
    updateData.name = body.name.trim();
  }

  if (body.branches && Array.isArray(body.branches)) {
    const sanitizedBranches = body.branches
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    if (sanitizedBranches.length === 0) {
      throw createError("At least one valid branch name is required.", 400);
    }

    updateData.branches = sanitizedBranches;
  }

  if (Object.keys(updateData).length === 0) {
    throw createError("No valid update data provided.", 400);
  }

  return await tenantRepo.updateTenantRepo(tenantId, updateData);
};