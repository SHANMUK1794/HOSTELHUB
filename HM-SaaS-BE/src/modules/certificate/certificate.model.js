// Migrated: replaced mongoose import with mongoose-compat (Prisma adapter)
// Maps to Prisma model: certificate
import mongoose from "../../config/mongoose-compat.js";

const { Schema } = mongoose;

const certificateSchema = new Schema(
  {
    tenantId: { type: String, required: true },
    branchName: { type: String, required: true },
    certificate_name: { type: String, required: true },
    certificate_no: { type: String, required: true },
    remainder_date: { type: Date, required: true },
    renewal_date: { type: Date, required: true },
    isdeleted: { type: Boolean, default: false },
    deleteddate: { type: Date, default: null },
    deleteby: { type: String, default: null },
  },
  { timestamps: true }
);

const certificate = mongoose.model("certificate", certificateSchema);
export default certificate;
