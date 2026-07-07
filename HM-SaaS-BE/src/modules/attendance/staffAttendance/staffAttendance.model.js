import mongoose from "../../../config/mongoose-compat.js";

const staffAttendanceSchema = new mongoose.Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    // 🛡️ THE FIX: Added admin_id for Tenant Isolation
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    attendance: [
      {
        uid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        staffName: String,
        role: String,
        shift: String,
        present: Boolean,
      },
    ],
  },
  { timestamps: true }
);

// 🛡️ THE NEW SECURE INDEX: tenantId + admin_id + date + branchName
staffAttendanceSchema.index({ tenantId: 1, admin_id: 1, date: 1, branchName: 1 }, { unique: true });

export default mongoose.models.staffAttendance ||
  mongoose.model("StaffAttendance", staffAttendanceSchema);