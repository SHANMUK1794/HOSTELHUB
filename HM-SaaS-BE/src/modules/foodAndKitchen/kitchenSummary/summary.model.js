import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
  // Multi-tenant isolation
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true,
  },

  date: { type: Date, default: Date.now },

  branchName: {
    type: String,
    required: true,
    trim: true,
  },

  totalPresent: { type: Number, default: 0 },
  totalAbsent: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  totalVeg: { type: Number, default: 0 },
  totalNonVeg: { type: Number, default: 0 },
});

summarySchema.index({ tenantId: 1, branchName: 1, date: 1 }, { unique: true });

const summary =
  mongoose.models.Summary || mongoose.model("Summary", summarySchema);

export default summary;