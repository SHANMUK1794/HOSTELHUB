// Migrated: replaced mongoose import with mongoose-compat (Prisma adapter)
// Maps to Prisma model: storeRoomInventory
import mongoose from "../../config/mongoose-compat.js";

const { Schema } = mongoose;

const storeRoomInventorySchema = new Schema(
  {
    tenantId: { type: String, required: true },
    branchName: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    used: { type: Number, required: true },
    balance: { type: Number, required: true },
    isdeleted: { type: Boolean, default: false },
    deleteddate: { type: Date, default: null },
    deleteby: { type: String, default: null },
  },
  { timestamps: true }
);

const storeRoomInventory = mongoose.model("StoreRoomInventory", storeRoomInventorySchema);
export default storeRoomInventory;
