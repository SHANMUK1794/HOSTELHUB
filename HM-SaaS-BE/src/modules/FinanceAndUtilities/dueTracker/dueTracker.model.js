import mongoose from "mongoose";

const dueTrackerSchema = new mongoose.Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    total_amount: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    paid_amount: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["borrowed", "paid"],
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
  isdeleted: { type: Boolean, default: false }, // Make sure this exists in all of them
  deletedinfo: {
    deleteddate: { type: Date, default: null },
    deleteby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    module: { type: String, default: "FinanceUtilities" },
  },
  },
  { timestamps: true },
);

const dueTracker = mongoose.model("DueTracker", dueTrackerSchema);

export default dueTracker;
