import mongoose from "../../config/mongoose-compat.js";

const userschema = new mongoose.Schema(
  {
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

    RoomNo: {
      type: String,
      required: function () {
        return this.staying === true;
      },
      default: null,
      trim: true,
    },

    BillNo: {
      type: String,
      required: true,
      trim: true,
    },

    checkin: {
      type: Date,
      default: Date.now,
    },

    checkout: {
      type: Date,
      default: null,
    },

    Name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    MobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },

    Reason: {
      type: String,
      enum: ["Full-Day", "Refreshment"],
      required: [true, "Reason is required"],
      trim: true,
    },

    Rent: {
      type: Number,
      default: 0,
    },

    PaymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      trim: true,
    },

    Paymentstatus: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
    },

    Discount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["staying", "vacating", "vacated"],
      default: "staying",
    },

    staying: {
      type: Boolean,
      default: true,
    },

    AddharNumber: {
      type: String,
      trim: true,
    },

    costPerDay: {
      type: Number,
      default: 0,
    },

    dayStayed: {
      type: Number,
      default: 1,
    },

    advance: {
      type: Number,
      default: 0,
    },

    due: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.pgdata ||
  mongoose.model("pgdata", userschema);