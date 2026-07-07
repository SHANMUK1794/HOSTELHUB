import mongoose from "../../../config/mongoose-compat.js";

const advanceSchema = new mongoose.Schema(
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
    staff_name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    advance: {
      type: Number,
      required: true,
      default: 0,
    },
    paid: {
      type: Number,
      required: true,
      default: 0,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },

  isdeleted: { type: Boolean, default: false },
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

const advance =  mongoose.model("Advance", advanceSchema);

export default advance;
