import * as subscriptionRepository from "./subscription.repository.js";
import Razorpay from "razorpay";
import crypto from "crypto";

/* ------------------------------------------------------------------ */
/*  PLAN CONFIG — single source of truth for pricing & billing        */
/* ------------------------------------------------------------------ */
const PLAN_CONFIG = {
  Shepherd: {
    amount: 0,
    currency: "INR",
    billingCycle: "trial",
    trialDays: 14,
  },
  Anointed: {
    amount: 999,
    currency: "INR",
    billingCycle: "monthly",
  },
  King: {
    amount: 1999,
    currency: "INR",
    billingCycle: "monthly",
  },
};

/* ------------------------------------------------------------------ */
/*  RAZORPAY SINGLETON                                                */
/* ------------------------------------------------------------------ */
let razorpayInstance;
const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  }
  return razorpayInstance;
};

/* ------------------------------------------------------------------ */
/*  CUSTOM ERROR HELPER                                               */
/* ------------------------------------------------------------------ */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/* ------------------------------------------------------------------ */
/*  GET MY SUBSCRIPTION                                               */
/* ------------------------------------------------------------------ */
export const getMySubscription = async (tenantId) => {
  if (!tenantId) {
    throw new AppError("No organization found.", 403);
  }

  const subscription = await subscriptionRepository.findByOrganizationId(tenantId);

  // Auto-expire check: if the subscription exists and its end date has passed
  if (subscription && subscription.subscriptionStatus === "active") {
    const now = new Date();

    const isTrialExpired =
      subscription.billingCycle === "trial" &&
      subscription.trialEndDate &&
      now > new Date(subscription.trialEndDate);

    const isPaidExpired =
      subscription.billingCycle !== "trial" &&
      subscription.subscriptionEndDate &&
      now > new Date(subscription.subscriptionEndDate);

    if (isTrialExpired || isPaidExpired) {
      subscription.subscriptionStatus = "expired";
      await subscriptionRepository.save(subscription);
    }
  }

  return subscription || null;
};

/*  ACTIVATE FREE TRIAL / DIRECT PLAN (Bypassed payment flow)         */
/* ------------------------------------------------------------------ */
export const activateFreeTrial = async (tenantId, planName) => {
  if (!tenantId) {
    throw new AppError("No organization found.", 403);
  }

  const config = PLAN_CONFIG[planName];
  if (!config) {
    throw new AppError("Invalid plan name.", 400);
  }

  let subscription = await subscriptionRepository.findByOrganizationId(tenantId);

  const now = new Date();
  const subEnd = new Date();
  
  if (config.billingCycle === "trial") {
    subEnd.setDate(now.getDate() + config.trialDays);
  } else if (config.billingCycle === "monthly") {
    subEnd.setMonth(now.getMonth() + 1);
  } else {
    subEnd.setMonth(now.getMonth() + 1);
  }

  const subscriptionData = {
    planName,
    amount: config.amount,
    currency: config.currency,
    billingCycle: config.billingCycle,
    subscriptionStatus: "active",
    paymentStatus: config.billingCycle === "trial" ? "pending" : "paid",
    hasUsedTrial: true,
    trialStartDate: config.billingCycle === "trial" ? now : undefined,
    trialEndDate: config.billingCycle === "trial" ? subEnd : undefined,
    subscriptionStartDate: config.billingCycle !== "trial" ? now : undefined,
    subscriptionEndDate: config.billingCycle !== "trial" ? subEnd : undefined,
    paymentDate: config.billingCycle !== "trial" ? now : undefined,
    razorpayOrderId: config.billingCycle !== "trial" ? "direct_activation" : undefined,
    razorpayPaymentId: config.billingCycle !== "trial" ? "direct_activation" : undefined,
    razorpaySignature: config.billingCycle !== "trial" ? "direct_activation" : undefined,
    cancelledAt: null,
  };

  if (subscription) {
    Object.assign(subscription, subscriptionData);
    await subscriptionRepository.save(subscription);
  } else {
    subscription = await subscriptionRepository.create({
      organizationId: tenantId,
      ...subscriptionData,
    });
  }

  return subscription;
};

/* ------------------------------------------------------------------ */
/*  CREATE RAZORPAY ORDER (for paid plans)                            */
/* ------------------------------------------------------------------ */
export const createOrder = async (tenantId, planName) => {
  if (!tenantId) {
    throw new AppError("No organization found.", 403);
  }

  const config = PLAN_CONFIG[planName];

  if (!config || planName === "Shepherd") {
    throw new AppError("Invalid paid plan.", 400);
  }

  const options = {
    amount: config.amount * 100, // Razorpay expects paise
    currency: config.currency,
    receipt: `rcpt_${tenantId.toString().substring(18)}_${Date.now()}`,
    notes: {
      tenantId: tenantId.toString(),
      planName,
    },
  };

  const rzp = getRazorpayInstance();
  const order = await rzp.orders.create(options);

  return order;
};

/* ------------------------------------------------------------------ */
/*  VERIFY RAZORPAY PAYMENT & ACTIVATE SUBSCRIPTION                  */
/* ------------------------------------------------------------------ */
export const verifyPayment = async (tenantId, paymentData) => {
  if (!tenantId) {
    throw new AppError("No organization found.", 403);
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planName,
  } = paymentData;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError("Missing payment details.", 400);
  }

  const config = PLAN_CONFIG[planName];
  if (!config || planName === "Shepherd") {
    throw new AppError("Invalid plan for paid activation.", 400);
  }

  // Verify Razorpay signature
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature !== expectedSign) {
    throw new AppError("Invalid payment signature.", 400);
  }

  // Calculate subscription period
  const now = new Date();
  const subEnd = new Date();

  if (config.billingCycle === "monthly") {
    subEnd.setMonth(now.getMonth() + 1);
  } else if (config.billingCycle === "yearly") {
    subEnd.setFullYear(now.getFullYear() + 1);
  }

  let subscription = await subscriptionRepository.findByOrganizationId(tenantId);

  const subscriptionData = {
    planName,
    amount: config.amount,
    currency: config.currency,
    billingCycle: config.billingCycle,
    subscriptionStatus: "active",
    paymentStatus: "paid",
    subscriptionStartDate: now,
    subscriptionEndDate: subEnd,
    paymentDate: now,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    cancelledAt: null,
  };

  if (subscription) {
    Object.assign(subscription, subscriptionData);
    await subscriptionRepository.save(subscription);
  } else {
    subscription = await subscriptionRepository.create({
      organizationId: tenantId,
      ...subscriptionData,
    });
  }

  return subscription;
};

/* ------------------------------------------------------------------ */
/*  CANCEL SUBSCRIPTION                                               */
/* ------------------------------------------------------------------ */
export const cancelSubscription = async (tenantId) => {
  if (!tenantId) {
    throw new AppError("No organization found.", 403);
  }

  const subscription = await subscriptionRepository.findByOrganizationId(tenantId);

  if (!subscription) {
    throw new AppError("No subscription found.", 404);
  }

  if (subscription.subscriptionStatus === "cancelled") {
    throw new AppError("Subscription is already cancelled.", 400);
  }

  subscription.subscriptionStatus = "cancelled";
  subscription.cancelledAt = new Date();

  await subscriptionRepository.save(subscription);

  return subscription;
};