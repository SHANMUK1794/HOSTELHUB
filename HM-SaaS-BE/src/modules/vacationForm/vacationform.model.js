import mongoose from "mongoose";

const vacationformschema = new mongoose.Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    applicationname: { type: String, required: true, trim: true },
    roomno: { type: String, default: null },
    floorno: { type: String, default: null },
    roomtype: { type: String, required: true, trim: true },
    userType: { type: String, enum: ["Resident", "PG"], default: null },
    dateofapply: { type: Date, required: true, default: () => Date.now() },
    vacatedate: { type: Date, required: true },
    mobile: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Vacated"], default: "Pending" },
    branchName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const vacationForm =
  mongoose.models.vacationForm ||
  mongoose.model("Vacationform", vacationformschema);

export default vacationForm;
