import { Schema, model } from "mongoose";
import mongoose from "../../../config/mongoose-compat.js";

const incomingFundSchema = new Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    date: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "Bank Transfer", "UPI", "Cheque"],
      trim: true,
    },
    branchName: {
      type: String,
      required: true,
    },
    receiverName: { type: String, required: true, trim: true },
    senderName: { type: String, required: true, trim: true },
   
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

const incomingFund = mongoose.model("incomingFund", incomingFundSchema);

export default incomingFund;
