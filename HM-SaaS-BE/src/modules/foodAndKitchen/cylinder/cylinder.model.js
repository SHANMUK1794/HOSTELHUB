// Migrated: replaced mongoose import with mongoose-compat (Prisma adapter)
// Maps to Prisma model: cylinder
import mongoose from "../../../config/mongoose-compat.js";

const { Schema } = mongoose;

const cylinderschema = new Schema(
  {
    tenantId: { type: String, required: true },
    branchName: { type: String, required: true },
    date: { type: Date, required: true },
    deliverydate: { type: Date, required: true },
    installeddate: { type: Date },
    emptydate: { type: Date },
    capacity: { type: Number, required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    usage: { type: String },
    isdeleted: { type: Boolean, default: false },
    deleteddate: { type: Date, default: null },
    deleteby: { type: String, default: null },
  },
  { timestamps: true }
);

const cylinder = mongoose.model("Cylinder", cylinderschema);
export default cylinder;