import * as subscriptionService from "./subscription.service.js";

/* ------------------------------------------------------------------ */
/*  GET MY SUBSCRIPTION                                               */
/* ------------------------------------------------------------------ */
export const getMySubscription = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const subscription = await subscriptionService.getMySubscription(tenantId);

    if (!subscription) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No active subscription found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------------------------------ */
/*  ACTIVATE FREE TRIAL (Shepherd plan)                               */
/* ------------------------------------------------------------------ */
export const activateSubscription = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { planName } = req.body;

    const subscription = await subscriptionService.activateFreeTrial(
      tenantId,
      planName
    );

    return res.status(200).json({
      success: true,
      data: subscription,
      message: "Successfully started your 14-day free trial.",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------------------------------ */
/*  CREATE RAZORPAY ORDER (for paid plans)                            */
/* ------------------------------------------------------------------ */
export const createRazorpayOrder = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { planName } = req.body;

    const order = await subscriptionService.createOrder(tenantId, planName);

    return res.status(200).json({
      success: true,
      order,
      message: "Order created successfully.",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------------------------------ */
/*  VERIFY RAZORPAY PAYMENT                                           */
/* ------------------------------------------------------------------ */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const subscription = await subscriptionService.verifyPayment(
      tenantId,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: subscription,
      message: `Successfully subscribed to ${subscription.planName} plan.`,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------------------------------------------ */
/*  CANCEL SUBSCRIPTION                                               */
/* ------------------------------------------------------------------ */
export const cancelSubscription = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const subscription = await subscriptionService.cancelSubscription(
      tenantId
    );

    return res.status(200).json({
      success: true,
      data: subscription,
      message: "Subscription cancelled successfully.",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
