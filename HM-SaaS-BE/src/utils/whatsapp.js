import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: CREDENTIAL RESOLVER (Centralized vs. Dedicated)
// ─────────────────────────────────────────────────────────────────────────────
const getWhatsAppCredentials = (tenantSettings) => {
  // If the admin flipped the switch to use their own Tech Provider keys
  if (
    tenantSettings?.useDedicatedWA &&
    tenantSettings?.customWAToken &&
    tenantSettings?.customWAPhoneId
  ) {
    return {
      accessToken: tenantSettings.customWAToken,
      phoneNumberId: tenantSettings.customWAPhoneId,
    };
  }

  // Otherwise, fallback to the Centralized SaaS `.env` credentials
  return {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_ID,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
const sendMetaTemplate = async (
  to,
  templateName,
  components,
  tenantSettings,
) => {
  const cleanTo = to.toString().replace(/\D/g, "");
  console.log(
    `📡 [WhatsApp Outbound - BYPASSED] template "${templateName}" to: 91${cleanTo}`,
  );
  return;
};

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED NOTIFICATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

const sendWhatsappMessage = async (to, name, roomNo, tenantSettings) => {
  if (tenantSettings && !tenantSettings.waEnableRegistration) {
    console.log("⚠️ [WhatsApp Blocked] waEnableRegistration toggle is OFF.");
    return;
  }

  const components = [
    { type: "text", text: String(name || "") },
    { type: "text", text: String(roomNo || "-") },
  ];
  await sendMetaTemplate(to, "registration_v2", components, tenantSettings);
};

const sendWhatsappMessageBirthday = async (to, Name, tenantSettings) => {
  if (tenantSettings && !tenantSettings.waEnableBirthday) {
    console.log("⚠️ [WhatsApp Blocked] waEnableBirthday toggle is OFF.");
    return;
  }

  const components = [{ type: "text", text: String(Name || "") }];
  await sendMetaTemplate(to, "birthday_greetings", components, tenantSettings);
};

const sendWhatsappMessageRoomrent = async (
  to,
  Name,
  Amount,
  Month,
  Due_Date,
  tenantSettings,
) => {
  if (tenantSettings && !tenantSettings.waEnableRentReminder) {
    console.log("⚠️ [WhatsApp Blocked] waEnableRentReminder toggle is OFF.");
    return;
  }

  const components = [
    { type: "text", text: String(Name || "") },
    { type: "text", text: String(Amount || "0") },
    { type: "text", text: String(Month || "") },
    { type: "text", text: String(Due_Date || "") },
  ];
  await sendMetaTemplate(to, "room_rent_reminder", components, tenantSettings);
};

const sendWhatsappMessageremainder = async (
  to,
  Name,
  Amount,
  Month,
  Date,
  tenantSettings,
) => {
  if (tenantSettings && !tenantSettings.waEnableRentLastDay) {
    console.log("⚠️ [WhatsApp Blocked] waEnableRentLastDay toggle is OFF.");
    return;
  }

  const components = [
    { type: "text", text: String(Name || "") },
    { type: "text", text: String(Amount || "0") },
    { type: "text", text: String(Month || "") },
    { type: "text", text: String(Date || "") },
  ];
  await sendMetaTemplate(to, "rent_last_day_alert", components, tenantSettings);
};

const sendWhatsappMessagecompliants = async (
  to,
  Name,
  Complaint_Description,
  Room_Number,
  Floor_Number,
  tenantSettings,
) => {
  if (tenantSettings && !tenantSettings.waEnableComplaintAck) {
    console.log("⚠️ [WhatsApp Blocked] waEnableComplaintAck toggle is OFF.");
    return;
  }

  const components = [
    { type: "text", text: String(Name || "") },
    { type: "text", text: String(Complaint_Description || "") },
    { type: "text", text: String(Room_Number || "-") },
    { type: "text", text: String(Floor_Number || "-") },
  ];
  await sendMetaTemplate(
    to,
    "complaint_acknowledgment",
    components,
    tenantSettings,
  );
};

const sendWhatsappMessagecompliantsResolved = async (
  to,
  Name,
  Complaint_Description,
  Room_Number,
  branchName,
  tenantSettings,
) => {
  if (tenantSettings && !tenantSettings.waEnableComplaintResolved) {
    console.log(
      "⚠️ [WhatsApp Blocked] waEnableComplaintResolved toggle is OFF.",
    );
    return;
  }

  const components = [
    { type: "text", text: String(Name || "") },
    { type: "text", text: String(Complaint_Description || "") },
    { type: "text", text: String(Room_Number || "-") },
    { type: "text", text: String(branchName || "") },
  ];
  await sendMetaTemplate(to, "complaint_resolved", components, tenantSettings);
};

const payment_confirmation = async (to, Name, Amount, tenantSettings) => {
  if (tenantSettings && !tenantSettings.waEnablePaymentConfirmation) {
    console.log(
      "⚠️ [WhatsApp Blocked] waEnablePaymentConfirmation toggle is OFF.",
    );
    return;
  }

  const components = [
    { type: "text", text: String(Name || "") },
    { type: "text", text: String(Amount || "0") },
  ];
  await sendMetaTemplate(
    to,
    "payment_confirmation",
    components,
    tenantSettings,
  );
};

const sendCustomMessage = async (to, content, tenantSettings) => {
  const components = [{ type: "text", text: String(content || "") }];
  await sendMetaTemplate(to, "custom_message", components, tenantSettings);
};

const sendPayrollMessage = async (
  to,
  Name,
  Month,
  Salary,
  Advance,
  Deduction,
  LeaveDays,
  NetSalary,
  tenantSettings,
) => {
  if (tenantSettings && !tenantSettings.waEnablePayroll) {
    console.log("⚠️ [WhatsApp Blocked] waEnablePayroll toggle is OFF.");
    return;
  }

  const components = [
    { type: "text", text: String(Name || "") },
    { type: "text", text: String(Month || "") },
    { type: "text", text: String(Salary || "0") },
    { type: "text", text: String(Advance || "0") },
    { type: "text", text: String(Deduction || "0") },
    { type: "text", text: String(LeaveDays || "0") },
    { type: "text", text: String(NetSalary || "0") },
  ];
  await sendMetaTemplate(
    to,
    "payroll_confirmation",
    components,
    tenantSettings,
  );
};

export {
  sendWhatsappMessage,
  sendWhatsappMessageBirthday,
  sendWhatsappMessageRoomrent,
  sendWhatsappMessageremainder,
  sendWhatsappMessagecompliants,
  sendWhatsappMessagecompliantsResolved,
  payment_confirmation,
  sendCustomMessage,
  sendPayrollMessage,
};