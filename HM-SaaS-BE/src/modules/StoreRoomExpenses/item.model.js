import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const storeRoomExpenseSchema = new Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    isdeleted: { type: Boolean, default: false },
    deletedinfo: {
      deleteddate: { type: Date, default: null },
      deleteby: { type: mongoose.Schema.ObjectId, ref: "user", default: null },
      module: { type: String, default: "StoreRoom" },
    },
  },
  {
    timestamps: true,
  },
);

const storeRoomExpense =
  mongoose.models.StoreRoomExpense ||
  mongoose.model("StoreRoomExpense", storeRoomExpenseSchema);

export default storeRoomExpense;
