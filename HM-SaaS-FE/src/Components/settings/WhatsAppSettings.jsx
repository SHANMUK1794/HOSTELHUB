import React from "react";
import {
  MessageCircle,
  UserPlus,
  Cake,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Wrench,
  Briefcase,
  Settings,
  Lock
} from "lucide-react";

// Reusable Section Title matching your Settings theme
const SectionTitle = ({ children, icon: Icon }) => (
  <div
    className="flex items-center gap-2 mb-5 pb-2 border-b"
    style={{ borderColor: "#e5e7eb" }}
  >
    {Icon && <Icon size={16} style={{ color: "var(--theme-accent)" }} />}
    <h2
      className="text-base font-bold"
      style={{
        color: "var(--theme-heading-text)",
        fontFamily: "var(--theme-font-family-primary)",
      }}
    >
      {children}
    </h2>
  </div>
);

// Reusable Toggle Switch Component
const ToggleSwitch = ({ label, description, checked, onChange, icon: Icon }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "var(--theme-filter-bg)" }}>
    <div className="flex items-start gap-3">
      <div className="mt-1" style={{ color: "var(--theme-accent)" }}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--theme-primary-text)" }}>
          {label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--theme-muted-text)" }}>
          {description}
        </p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked || false}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: checked ? "var(--theme-accent)" : "#d1d5db" }}></div>
    </label>
  </div>
);

const WhatsAppSettings = ({ businessConfig, handleBusinessChange }) => {
  return (
    <div className="max-w-3xl">
      
      {/* ─────────────────────────────────────────────────────────
          WHATSAPP PROVIDER INTEGRATION (NEW)
      ───────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 shadow-sm border-2 border-dashed border-indigo-200 mb-6"
        style={{ backgroundColor: "#fdfdff" }}
      >
        <SectionTitle icon={Settings}>WhatsApp Provider Integration</SectionTitle>
        
        <ToggleSwitch
          icon={Lock}
          label="Use Dedicated WhatsApp API Provider"
          description={businessConfig.useDedicatedWA 
            ? "You are using your own Meta credentials. API calls will bypass system defaults." 
            : "Using default Hostelos Centralized API. Perfect for smaller setups."}
          checked={businessConfig.useDedicatedWA}
          onChange={handleBusinessChange("useDedicatedWA")}
        />

        {businessConfig.useDedicatedWA && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "var(--theme-primary-text)" }}>
                Meta Access Token
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border text-sm"
                placeholder="EAA..."
                value={businessConfig.customWAToken || ""}
                onChange={(e) => handleBusinessChange("customWAToken")(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: "var(--theme-primary-text)" }}>
                Phone Number ID
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border text-sm"
                placeholder="118..."
                value={businessConfig.customWAPhoneId || ""}
                onChange={(e) => handleBusinessChange("customWAPhoneId")(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
      {/* ─────────────────────────────────────────────────────────
          RESIDENT AUTOMATIONS
      ───────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <SectionTitle icon={MessageCircle}>Resident Automations</SectionTitle>
        <ToggleSwitch
          icon={UserPlus}
          label="Registration Welcome Message"
          description="Send an instant welcome WhatsApp when a new resident is checked into a room."
          checked={businessConfig.waEnableRegistration}
          onChange={handleBusinessChange("waEnableRegistration")}
        />
        <ToggleSwitch
          icon={Cake}
          label="Birthday Greetings"
          description="Automatically send a birthday wish template at 9:00 AM on the resident's birthday."
          checked={businessConfig.waEnableBirthday}
          onChange={handleBusinessChange("waEnableBirthday")}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────
          FINANCIAL & RENT ALERTS
      ───────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <SectionTitle icon={CreditCard}>Financial & Rent Alerts</SectionTitle>
        <ToggleSwitch
          icon={CreditCard}
          label="Monthly Rent Generation Reminder"
          description="Notify residents the moment their monthly rent bill is generated."
          checked={businessConfig.waEnableRentReminder}
          onChange={handleBusinessChange("waEnableRentReminder")}
        />
        <ToggleSwitch
          icon={AlertCircle}
          label="Due Date Last-Day Alert"
          description="Send an urgent reminder 24 hours before the final rent payment due date."
          checked={businessConfig.waEnableRentLastDay}
          onChange={handleBusinessChange("waEnableRentLastDay")}
        />
        <ToggleSwitch
          icon={CheckCircle}
          label="Payment Confirmation Receipt"
          description="Send an instant receipt via WhatsApp when a payment/installment is logged."
          checked={businessConfig.waEnablePaymentConfirmation}
          onChange={handleBusinessChange("waEnablePaymentConfirmation")}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────
          OPERATIONS & HR
      ───────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <SectionTitle icon={Wrench}>Operations & Staff Support</SectionTitle>
        <ToggleSwitch
          icon={Wrench}
          label="Complaint Acknowledgment"
          description="Send a confirmation ticket to the resident when they submit a new complaint."
          checked={businessConfig.waEnableComplaintAck}
          onChange={handleBusinessChange("waEnableComplaintAck")}
        />
        <ToggleSwitch
          icon={CheckCircle}
          label="Complaint Resolved Notification"
          description="Notify the resident automatically when their complaint status changes to resolved."
          checked={businessConfig.waEnableComplaintResolved}
          onChange={handleBusinessChange("waEnableComplaintResolved")}
        />
        <ToggleSwitch
          icon={Briefcase}
          label="Staff Salary Slip Alert"
          description="Send a payroll breakdown to staff when their monthly salary is released."
          checked={businessConfig.waEnablePayroll}
          onChange={handleBusinessChange("waEnablePayroll")}
        />
      </div>
      
    </div>
  );
};

export default WhatsAppSettings;