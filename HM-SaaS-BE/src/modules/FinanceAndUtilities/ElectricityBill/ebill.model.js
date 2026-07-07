import mongoose from "../../../config/mongoose-compat.js";

const electricityBillSchema = new mongoose.Schema(
  {
    // Multi-tenant isolation
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    SNo: { type: Number, required: true },
    RoomNo: { type: String, required: true },
    FloorNo: { type: String, required: true },
    Month: { type: String, required: true },
    PrevMonth: { type: Number, required: true },
    CurrentMonth: { type: Number, required: true },
    Amount: { type: Number, required: true },
    PerHead: { type: Number, required: true },
    Roomrent: { type: Number, required: true },
    Sharing: { type: Number, required: true },
    total: { type: Number, required: true },
    IsDiscounted: { type: Boolean, default: false, required: true },
    DisAmt: { type: Number, default: 0 },
    Extras: { type: Number, default: 0 },
    TotalPresent: { type: Number, default: 0 },
    Year: { type: Number, required: true },
    Status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    paymentdate: { type: Date, default: null },
    paymethod: { type: String, default: null },
    branchName: {
      type: String,
      required: true,
    },
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
    },
    UserName: {
      type: String,
      required: true,
    },
    Units: { type: Number, required: true },
    
   isdeleted: { type: Boolean, default: false }, // Make sure this exists in all of them
  deletedinfo: {
    deleteddate: { type: Date, default: null },
    deleteby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    module: { type: String, default: "FinanceUtilities" },
  },
  },
  { timestamps: true },
);

electricityBillSchema.set("toJSON", { virtuals: false });
electricityBillSchema.set("toObject", { virtuals: false });

const electricityBill = mongoose.models.ElectricityBill || mongoose.model("ElectricityBill", electricityBillSchema);

export default electricityBill;
