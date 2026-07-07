import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      unique: true, // One subscription per tenant
    },
    planName: {
      type: String,
      enum: ["Shepherd", "Anointed", "King"],
      required: true,
      default: "Shepherd"
    },
    amount:{
      type: Number,
      required: true,
      default: 0
    },
    currency: {
      type: String,
      default: "INR",
    },
    billingCycle: {
      type: String,
      enum: ["trial", "monthly", "yearly"],
      default: "trial",
    },   
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "expired", "cancelled", "pending"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed", "refunded"],
      default: "pending",
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    hasUsedTrial: {
      type: Boolean,
      default: false,
    },
    trialStartDate: {
       type: Date ,
       default: null,
    },
    trialEndDate: {
       type: Date,
       default: null 
    },
    subscriptionStartDate: {
      type: Date,
      default: null,
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  
  },{timestamps: true}
);

const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
