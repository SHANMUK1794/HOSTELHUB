import { Schema, model } from "mongoose";
import user from "../../modules/userController/auth.model.js";
const allowedBranches = [
  "IOB Mens Hostel",
  "Rameswaram Mens Hostel",
  "New Mens Hostel",
  "Womens Hostel",
  "Kitchen branch",
  "Office",
];

const certificateSchema = new Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    certificate_name: {
      type: String,
      required: true,
      trim: true,
    },
    certificate_no: {
      type: String,
      required: true,
      trim: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    remainder_date: {
      type: Date,
      required: true,
    },
    renewal_date: {
      type: Date,
      required: true,
    },
    isdeleted: { type: Boolean, default: false },
    deletedinfo: {
      deleteddate: { type: Date, default: null },
      deleteby: { type: Schema.Types.ObjectId, ref: "user", default: null },
      module: { type: String, default: "certificate" },
    },
  },
  {
    timestamps: true,
  },
);

const certificate = model("certificate", certificateSchema);
export default certificate;
