import mongoose from "mongoose";
import employee from "../employee/employee.model.js";

const userschema = new mongoose.Schema({
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

  DateOfJoining: { type: Date, default: Date.now },
  Registerdate: { type: Date, default: Date.now },

  RoomNo: {
  type: String,
  default: null,
  },

  BillNo: { type: String, required: true },
  Name: { type: String, required: true },
  DateOfBirth: { type: Date, required: true },
  MobileNo: { type: String, required: true },
  SameAsWhatsapp: { type: Boolean, required: true },
  Whatsapp: { type: String, required: true },
  Email: { type: String, required: true },
  PermanentAddress: { type: String, required: true },
  AddharNumber: { type: String, required: true },

  FoodType: { type: String, enum: ["Veg", "Non-Veg"], required: true },
  RoomType: { type: String, enum: ["AC", "Non-AC"], required: true },

  // ================= ROOM =================
  FloorNo: {
  type: String,
  default: "-",
},

  // ================= FINANCIAL =================
  Deposit: {
  type: Number,
  default: 0,
},
  Discount: { type: Number, default: 0 },
  Advance: { type: Number, default: 0 },

  // ================= OTHER =================
  Parking: { type: Boolean, default: false },
  vehicleNo: { type: String, default: null },

  status: {
    type: String,
    enum: ["staying", "vacating", "vacated"],
    default: "staying",
  },

  staying: { type: Boolean, default: true },
  vacatedate: { type: Date, default: null },
  Rejoiningdate: { type: Date, default: null },
  isdeleted: { type: Boolean, default: false },

  deletedinfo: {
    deleteddate: { type: Date, default: null },
    deleteby: {
      type: mongoose.Schema.ObjectId,
      ref: employee,
      default: null,
    },
    module: { type: String, default: "register" },
  },
});

const register =
  mongoose.models.Register || mongoose.model("Register", userschema);

export default register;