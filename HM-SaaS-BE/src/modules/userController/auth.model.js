import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    staffName: { type: String, required: true, trim: true },
    role: { type: String, required: false, trim: true },
    shift: { type: String, required: false, trim: true },
    username: { type: String, required: false, trim: true },
    phoneNo: { type: Number, required: false },

    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    password: { type: String, required: true },

    // Multi-tenant: reference to the Tenant (Hostel/PG organization)
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null, // null until user creates a tenant after signup
    },

    // For sub-users created by an Admin via User&Roles
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // branchName is now a free-form String — each tenant defines their own branches
    branchName: {
      type: String,
      required: true,
      trim: true,
    },

    staying: { type: Boolean, default: true },
    vacatedate: { type: Date, default: null },
    refreshToken: { type: String },

    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },

    isdeleted: { type: Boolean, default: false },

    deletedinfo: {
      deleteddate: { type: Date, default: null },
      deleteby: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: null,
      },
      module: { type: String, default: "user" },
    },
  },
  { timestamps: true }
);

// Index for tenant-based queries
userSchema.index({ tenantId: 1 });

// Safe model registration — reuse if already compiled
const user = mongoose.models.User || mongoose.model("User", userSchema);

export default user;