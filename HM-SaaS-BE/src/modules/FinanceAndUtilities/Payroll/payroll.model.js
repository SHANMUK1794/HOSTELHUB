import { Schema, model } from "mongoose";
import mongoose from "../../../config/mongoose-compat.js";

const payrollSchema = new Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    DOJ: { type: Date, required: true },
    date: { type: Date, required: true },
    month: { type: String, required: true },
    mobile: { type: Number, required: true },
    staff_name: { type: String, required: true, trim: true },
    staff_role: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
    advance: { type: Number, required: true, min: 0, default: 0 },
    balance: { type: Number, required: true, min: 0 },
    overtime: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    deduction: { type: Number, default: 0, min: 0 },
    workingdays: { type: Number, default: 0 },
    leave: { type: Number, default: 0, min: 0 },
    cl: { type: Number, default: 0, min: 0 },
    leavewages: { type: Number, default: 0, min: 0 },
    paymentmethod: { type: String, required: true },
    roundoff: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      required: true,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
      trim: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
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

const payrool = mongoose.model("Payroll", payrollSchema);

export default payrool;
