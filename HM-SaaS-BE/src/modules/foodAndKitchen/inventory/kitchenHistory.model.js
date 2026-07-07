import mongoose from "mongoose";

const kitchenHistorySchema = new mongoose.Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    date: { type: Date, required: true },
    itemName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    used: { type: Number, required: true },
    balance: { type: Number, required: true },

    isdeleted: { type: Boolean, default: false },
    deletedinfo: {
      deleteddate: { type: Date, default: null },
      deleteby: { type: mongoose.Schema.ObjectId, ref: "user", default: null },
      module: { type: String, default: "kitchenInventory" },
    },
  },
  { timestamps: true }
);

const kitchenHistory =
  mongoose.models.KitchenHistory ||
  mongoose.model("KitchenHistory", kitchenHistorySchema);

export default kitchenHistory;

// export default mongoose.models.Inventory ||
//   mongoose.model("Inventory", kitchenHistorySchema);