import mongoose from "../../config/mongoose-compat.js";

/**
 * Tenant Model — Represents a Hostel/PG organization.
 * Each tenant is a completely isolated workspace.
 * The admin who signs up becomes the owner.
 */
const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },

    // The admin user who created this tenant
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Dynamic branch list — each tenant defines their own branches
    branches: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one branch is required",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for fast lookups by owner
tenantSchema.index({ owner: 1 });

const Tenant =
  mongoose.models.Tenant || mongoose.model("Tenant", tenantSchema);

export default Tenant;
