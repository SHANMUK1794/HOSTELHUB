import mongoose from "mongoose";

const rentschema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    branchName: { type: String, required: true },
    ResidentName: { type: String, required: true },
    RoomNo: { type: String, required: true },
    FloorNo: { type: String, required: true },
    BillNo: { type: String, required: true },
    MobileNo: { type: Number, required: true },
    RoomDeposit: { type: Number, required: true },
    RoomRent: { type: Number, required: true },
    EBDeposit: { type: Number, required: true },
    Total: { type: Number, required: true },
    DisAmt: { type: Number, default: 0 },
    Advance: { type: Number, required: true },
    Balance: { type: Number, required: true },
    Status: { type: String, required: true },
    PaymentMethod: { type: String, required: true },  
    
    // 👉 NEW: History Array to track all installments
    paymentHistory: [
      {
        date: { type: String },
        time: { type: String },
        amountPaid: { type: Number },
        balanceAfter: { type: Number },
        paymentMethod: { type: String }
      }
    ],
    
    isdeleted: { type: Boolean, default: false },
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

const roomRent = mongoose.model("RoomRent", rentschema);
export default roomRent;