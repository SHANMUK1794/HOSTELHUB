// Migrated: replaced mongoose import with mongoose-compat (Prisma adapter)
// Maps to Prisma model: complaint
import mongoose from "../../config/mongoose-compat.js";

const { Schema } = mongoose;

const complaintSchema = new Schema(
  {
    tenantId: { type: String, required: true },
    branchName: { type: String, required: true },
    room_no: { type: String },
    floor: { type: String },
    date: { type: Date, required: true },
    issue: { type: String, required: true },
    issue_description: { type: String, required: true },
    status: { type: String, default: "Pending" },
    isdeleted: { type: Boolean, default: false },
    deleteddate: { type: Date, default: null },
    deleteby: { type: String, default: null },
  },
  { timestamps: true }
);

const complaint = mongoose.model("Complaint", complaintSchema);
export default complaint;
