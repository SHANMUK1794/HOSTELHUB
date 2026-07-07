import mongoose from "../../../config/mongoose-compat.js";

const expenseSchema = new mongoose.Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    date: { type: Date, default: Date.now },
    itemName: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true},
    total: { type: Number, default: 0 },
    isdeleted: { type: Boolean, default: false },
    deletedinfo: {
      deleteddate: { type: Date, default: null },
      deleteby: { type: mongoose.Schema.ObjectId, ref: "user", default: null },
      module: { type: String, default: "kitchenExpense" },
    },
  },
  { timestamps: true },
);

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);
export default Expense;
