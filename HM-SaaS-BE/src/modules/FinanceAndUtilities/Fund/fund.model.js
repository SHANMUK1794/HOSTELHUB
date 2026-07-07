// Migrated: replaced mongoose import with mongoose-compat (Prisma adapter)
// Maps to Prisma model: fund (via "incomingFund" → "fund" mapping)
import mongoose from "../../../config/mongoose-compat.js";

const { Schema } = mongoose;

const incomingFundSchema = new Schema(
  {
    tenantId: { type: String, required: true },
    branchName: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, required: true },
    receiverName: { type: String, required: true },
    senderName: { type: String, required: true },
    isdeleted: { type: Boolean, default: false },
    deleteddate: { type: Date, default: null },
    deleteby: { type: String, default: null },
  },
  { timestamps: true }
);

const incomingFund = mongoose.model("incomingFund", incomingFundSchema);
export default incomingFund;
