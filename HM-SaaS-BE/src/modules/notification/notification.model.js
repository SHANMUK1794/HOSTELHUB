import mongoose from "../../config/mongoose-compat.js";

const notificationSchema = new mongoose.Schema({
  // Multi-tenant isolation
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true,
  },

  branchName: { type: String, required: true },
  type: {
    type: String,
    enum: ["birthday", "certificate", "Complaint", "system", "custom"],
    required: true,
  },
  title: {
  type: String,
  default: "Notification",
  },
  message: { type: String, required: true },
  route: { type: String, default: null },
  date: { type: Date, required: true },
  adminSeen: { type: Boolean, default: false },
  wardenSeen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for performance and uniqueness
notificationSchema.index(
  { branchName: 1, type: 1, route: 1, date: 1 },
  { unique: true, partialFilterExpression: { route: { $exists: true } } },
);

notificationSchema.index(
  {
    tenantId: 1,
    branchName: 1,
    type: 1,
    date: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      type: "birthday",
    },
  }
);

export default mongoose.model("Notification", notificationSchema);
