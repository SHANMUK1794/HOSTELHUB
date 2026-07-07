import mongoose from "mongoose";
import user from "../User&Roles/userRoles.model.js";

const achievementSchema = new mongoose.Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    date: { type: Date, required: true },
    roomno: { type: String, required: true },
    floorno: { type: String, required: true },
    name: { type: String, required: true },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
    position: { type: String, required: true },
    
    // BUG FIX: Uncommented photo and made it optional
    photo: { type: String, default: null }, 
    
    isdeleted: { type: Boolean, default: false },
    deletedinfo: {
      deleteddate: { type: Date, default: null },
      deleteby: { type: mongoose.Schema.ObjectId, ref: "user", default: null },
      module: { type: String, default: "achievement" },
    },
  },
  { timestamps: true },
);

const achievement = mongoose.model("Achievement", achievementSchema);
export default achievement;