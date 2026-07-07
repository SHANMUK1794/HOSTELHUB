// Migrated: replaced mongoose import with mongoose-compat (Prisma adapter)
// Maps to Prisma model: storeRoomHistory
import mongoose from "../../config/mongoose-compat.js";

const { Schema } = mongoose;

const storeRoomHistorySchema = new Schema(
  {
    tenantId: { type: String, required: true },
    branchName: { type: String, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

const storeRoomHistory = mongoose.model("StoreRoomHistory", storeRoomHistorySchema);
export default storeRoomHistory;
