import { Schema, model, mongoose } from "mongoose";
import user from "../userController/auth.model.js";
const storeRoomInventorySchema = new Schema(
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
    used: {
      type: Number,
      required: true,
    },
    balance: {
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
      module: { type: String, default: "achievement" },
    },
  },
  {
    timestamps: true,
  },
);

const storeRoomInventory = model(
  "StoreRoomInventory",
  storeRoomInventorySchema,
);
export default storeRoomInventory;
