import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const dailyExpenseSchema = new Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    date: { type: Date, required: true },
    work: { type: String, required: true, trim: true },
    voucherno: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Paid", "Unpaid"],
      trim: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    // "certificate" to "FinanceUtilities"
  isdeleted: { type: Boolean, default: false },
  deletedinfo: {
    deleteddate: { type: Date, default: null },
    deleteby: { type: Schema.Types.ObjectId, ref: "user", default: null },
    module: { type: String, default: "FinanceUtilities" }, // Fixed default
  },
  },
  { timestamps: true },
);

const dailyExpense = mongoose.model("daily_expense", dailyExpenseSchema);

export default dailyExpense;
