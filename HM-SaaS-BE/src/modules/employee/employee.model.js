import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    Name: { type: String, required: true, trim: true },
    EmpNo: { type: String, required: true, trim: true },
    DOJ: { type: Date, required: true },
    DOB: { type: Date, required: true },
    Age: { type: Number, min: 0 },
    Designation: { type: String },
    Shift: { type: String, required: false, trim: true },
    Mobile: { type: Number, required: true },
    Salary: { type: Number, required: true, min: 0 },
    PerDay: { type: Number, required: true, min: 0 },
    Advance: { type: Number, default: 0 },
    isdeleted: { type: Boolean, default: false },
    deletedinfo: {
      deleteddate: { type: Date, default: null },
      deleteby: { type: mongoose.Schema.ObjectId, ref: "user", default: null },
      module: { type: String, default: "employee" },
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;