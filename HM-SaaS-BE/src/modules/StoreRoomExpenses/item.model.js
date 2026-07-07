// Migrated: replaced mongoose import with mongoose-compat (Prisma adapter)
// Maps to Prisma model: item (StoreRoomExpense → Item)
import mongoose from "../../config/mongoose-compat.js";

const { Schema } = mongoose;

const storeRoomExpenseSchema = new Schema(
  {
    tenantId: { type: String, required: true },
    branchName: { type: String, required: true },
    date: { type: Date, required: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    isdeleted: { type: Boolean, default: false },
    deleteddate: { type: Date, default: null },
    deleteby: { type: String, default: null },
  },
  { timestamps: true }
);

const storeRoomExpense = mongoose.model("StoreRoomExpense", storeRoomExpenseSchema);
export default storeRoomExpense;
