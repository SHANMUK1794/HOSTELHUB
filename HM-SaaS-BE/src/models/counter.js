import mongoose from "../config/mongoose-compat.js";

const counterSchema = new mongoose.Schema({
  // Multi-tenant isolation
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true,
  },
  name: { type: String, required: true },
  value: { type: Number, default: 1 },
});

// Each tenant has their own independent counters
counterSchema.index({ tenantId: 1, name: 1 }, { unique: true });

const counter = mongoose.model("Counter", counterSchema);
export default counter;
