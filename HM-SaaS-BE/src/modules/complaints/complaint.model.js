import { Schema, model } from "mongoose";
import user from "../../modules/User&Roles/userRoles.model.js";

const allowedBranches = [
  "IOB Mens Hostel",
  "Rameswaram Mens Hostel",
  "New Mens Hostel",
  "Womens Hostel",
  "Office",
  "Kitchen branch",
];

const complaintSchema = new Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    room_no: {
      type: String,
      trim: true,
    },
    floor: { 
      type: String,
      trim: true, 
    },
    date: {
      type: Date,
      required: true,
    },
    issue: {
      type: String,
      required: true,
      trim: true,
    },
    issue_description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Working", "Solved"],
      trim: true,
    },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
    deletedinfo: {
      deleteddate: { type: Date, default: null },
      deleteby: { type: Schema.Types.ObjectId, ref: "user", default: null },
      module: { type: String, default: "complaint" }, // <-- Fixed  bug before it was "certificate"
    },
  },
  {
    timestamps: true,
  },
);

const complaint = model("Complaint", complaintSchema);
export default complaint;
