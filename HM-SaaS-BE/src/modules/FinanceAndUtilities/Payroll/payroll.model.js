// Migrated: replaced mongoose import with mongoose-compat (Prisma adapter)
// Maps to Prisma model: payroll
import mongoose from "../../../config/mongoose-compat.js";

const { Schema } = mongoose;

const payrollSchema = new Schema(
  {
    tenantId: { type: String, required: true },
    branchName: { type: String, required: true },
    employeeId: { type: String, required: true },
    DOJ: { type: Date, required: true },
    date: { type: Date, required: true },
    month: { type: String, required: true },
    mobile: { type: Number, required: true },
    staff_name: { type: String, required: true },
    staff_role: { type: String, required: true },
    salary: { type: Number, required: true, min: 0 },
    advance: { type: Number, default: 0, min: 0 },
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
    status: { type: String, default: "Unpaid" },
    isdeleted: { type: Boolean, default: false },
    deleteddate: { type: Date, default: null },
    deleteby: { type: String, default: null },
  },
  { timestamps: true }
);

const payrool = mongoose.model("Payroll", payrollSchema);
export default payrool;
