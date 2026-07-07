/**
 * User Roles Model
 *
 * Re-exports the canonical User model from auth.model.js
 * to avoid duplicate schema registration conflicts.
 *
 * Previously this file defined its own User schema with different fields
 * (e.g., admin_id as required), which caused unpredictable behavior
 * depending on import order. Now there is a single source of truth.
 */
import user from "../userController/auth.model.js";

export default user;