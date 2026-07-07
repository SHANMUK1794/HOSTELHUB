import mongoose from "../../config/mongoose-compat.js";

const settingsSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      unique: true,
    },
    ebRatePerUnit: { type: Number, default: 10 },
    registrationFee: { type: Number, default: 500 },
    ebDeposit: { type: Number, default: 1000 },
    securityDeposit: { type: Number, default: 2000 },
    workingDaysPerMonth: { type: Number, default: 30 },
    workingHoursPerDay: { type: Number, default: 8 },
    overtimeMultiplier: { type: Number, default: 1 },
    casualLeavePerMonth: { type: Number, default: 2 },
  // 👉 NEW: WhatsApp Automation Toggles added to Schema
    waEnableRegistration: { type: Boolean, default: false },
    waEnableBirthday: { type: Boolean, default: false },
    waEnableRentReminder: { type: Boolean, default: false },
    waEnableRentLastDay: { type: Boolean, default: false },
    waEnablePaymentConfirmation: { type: Boolean, default: false },
    waEnableComplaintAck: { type: Boolean, default: false },
    waEnableComplaintResolved: { type: Boolean, default: false },
    waEnablePayroll: { type: Boolean, default: false },

    // 👉 NEW: Tech Provider Isolation Settings
    useDedicatedWA: { type: Boolean, default: false }, // False = Centralized, True = Dedicated
    customWAToken: { type: String, default: "" },
    customWAPhoneId: { type: String, default: "" },
  },
  { timestamps: true },
);
export default mongoose.model("Settings", settingsSchema);
