// import mongoose from "../../../config/mongoose-compat.js";

// const inventorySchema = new mongoose.Schema({
//   itemName: { type: String, required: true },
//   quantity: { type: Number, required: true },
//   unit: { type: String, trim: true },
// }, { timestamps: true });

// // Keeping the model name "KitchenHistory" as per your provided logic
// export default mongoose.model("KitchenHistory", inventorySchema);

import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  // Multi-tenant isolation
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true,
  },

  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, trim: true },
}, { timestamps: true });

// export default mongoose.model("Inventory", inventorySchema);
export default mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
// export default mongoose.models.KitchenHistory || mongoose.model("KitchenHistory", inventorySchema);