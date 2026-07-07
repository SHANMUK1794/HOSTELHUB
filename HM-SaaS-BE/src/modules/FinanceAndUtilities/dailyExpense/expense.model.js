// Migrated: replaced mongoose import with mongoose-compat (Prisma adapter)
// Maps to Prisma model: dailyExpense (via "daily_expense" → "dailyExpense" mapping)
import mongoose from "../../../config/mongoose-compat.js";

const { Schema } = mongoose;

const dailyExpenseSchema = new Schema(
  {
    tenantId: { type: String, required: true },
    branchName: { type: String, required: true },
    date: { type: Date, required: true },
    work: { type: String, required: true },
    voucherno: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    isdeleted: { type: Boolean, default: false },
    deleteddate: { type: Date, default: null },
    deleteby: { type: String, default: null },
  },
  { timestamps: true }
);

const dailyExpense = mongoose.model("daily_expense", dailyExpenseSchema);
export default dailyExpense;
