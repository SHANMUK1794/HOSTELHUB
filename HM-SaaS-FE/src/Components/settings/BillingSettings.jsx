import React from "react";
import { Zap, Building2, DollarSign, Save, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI Components
// ─────────────────────────────────────────────────────────────────────────────
const SectionTitle = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-5 pb-2 border-b" style={{ borderColor: "#e5e7eb" }}>
    {Icon && <Icon size={16} style={{ color: "var(--theme-accent)" }} />}
    <h2 className="text-base font-bold" style={{ color: "var(--theme-heading-text)", fontFamily: "var(--theme-font-family-primary)" }}>
      {children}
    </h2>
  </div>
);

const FieldRow = ({ label, hint, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 mb-5">
    <div className="w-full sm:w-52 shrink-0">
      <label className="text-sm font-medium block" style={{ color: "var(--theme-primary-text)", fontFamily: "var(--theme-font-family-primary)" }}>
        {label}
      </label>
      {hint && <span className="text-xs" style={{ color: "var(--theme-muted-text)" }}>{hint}</span>}
    </div>
    {children}
  </div>
);

const NumberInput = ({ value, onChange, prefix, suffix, min = 0, step = 1 }) => (
  <div className="flex items-center gap-2">
    {prefix && <span className="text-sm font-semibold" style={{ color: "var(--theme-accent)" }}>{prefix}</span>}
    <input
      type="number" value={value} min={min} step={step}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none font-semibold"
      style={{ fontFamily: "var(--theme-font-family-primary)", color: "var(--theme-primary-text)", backgroundColor: "var(--theme-filter-bg)" }}
    />
    {suffix && <span className="text-sm" style={{ color: "var(--theme-muted-text)" }}>{suffix}</span>}
  </div>
);

const ConfigSummaryCard = ({ label, value, unit, icon: Icon, color }) => (
  <div className="rounded-xl p-4 border flex items-center gap-3" style={{ backgroundColor: "var(--theme-card-bg)", borderColor: "var(--theme-accent)20" }}>
    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "20" }}>
      <Icon size={18} style={{ color }} />
    </div>
    <div>
      <p className="text-xs font-medium" style={{ color: "var(--theme-muted-text)" }}>{label}</p>
      <p className="text-lg font-bold" style={{ color: "var(--theme-heading-text)" }}>{unit}{value}</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const BillingSettings = ({ businessConfig, handleBusinessChange, saveBusinessConfig, resetBusinessConfig, configSaved }) => {
  return (
    <div className="max-w-3xl">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <ConfigSummaryCard label="EB Rate / Unit" value={businessConfig.ebRatePerUnit} unit="₹" icon={Zap} color="#f59e0b" />
        <ConfigSummaryCard label="Registration Fee" value={businessConfig.registrationFee} unit="₹" icon={Building2} color="#6366f1" />
        <ConfigSummaryCard label="EB Deposit" value={businessConfig.ebDeposit} unit="₹" icon={DollarSign} color="#10b981" />
        <ConfigSummaryCard label="Security Deposit" value={businessConfig.securityDeposit} unit="₹" icon={DollarSign} color="#f59e0b" />
      </div>

      <div className="rounded-2xl p-6 shadow-sm border border-gray-100 mb-6" style={{ backgroundColor: "var(--theme-card-bg)" }}>
        <SectionTitle icon={Zap}>Electricity Bill (EB)</SectionTitle>
        <FieldRow label="EB Rate per Unit" hint="Charged per kWh consumed">
          <NumberInput value={businessConfig.ebRatePerUnit} onChange={handleBusinessChange("ebRatePerUnit")} prefix="₹" suffix="/ unit" min={0} step={0.5} />
        </FieldRow>
        <div className="mt-3 p-3 rounded-xl text-sm" style={{ backgroundColor: "var(--theme-filter-bg)", color: "var(--theme-muted-text)" }}>
          <strong style={{ color: "var(--theme-heading-text)" }}>How it's used:</strong> When EB units are added,
          <code className="mx-1 px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: "var(--theme-secondary-card-bg)" }}>Amount = (CurrentUnits − PrevUnits) × EB Rate</code>
          and then split per resident.
        </div>
      </div>

      <div className="rounded-2xl p-6 shadow-sm border border-gray-100 mb-6" style={{ backgroundColor: "var(--theme-card-bg)" }}>
        <SectionTitle icon={Building2}>Room Rent Fees</SectionTitle>
        <FieldRow label="Registration Fee" hint="One-time fee on move-in">
          <NumberInput value={businessConfig.registrationFee} onChange={handleBusinessChange("registrationFee")} prefix="₹" min={0} step={50} />
        </FieldRow>
        <FieldRow label="EB Deposit" hint="Electricity security deposit on move-in">
          <NumberInput value={businessConfig.ebDeposit} onChange={handleBusinessChange("ebDeposit")} prefix="₹" min={0} step={100} />
        </FieldRow>
        <FieldRow label="Resident Deposit Amount" hint="Default refundable deposit collected when a resident joins the hostel">
          <NumberInput value={businessConfig.securityDeposit} onChange={handleBusinessChange("securityDeposit")} prefix="₹" min={0} step={500} />
        </FieldRow>
        <div className="mt-3 p-3 rounded-xl text-sm" style={{ backgroundColor: "var(--theme-filter-bg)", color: "var(--theme-muted-text)" }}>
          <strong style={{ color: "var(--theme-heading-text)" }}>Total formula:</strong>
          <code className="ml-1 px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: "var(--theme-secondary-card-bg)" }}>
            RoomRent + SecurityDeposit + EBDeposit + RegistrationFee − Discount
          </code>
        </div>
      </div>

      {/* Save / Reset */}
      <div className="flex items-center gap-4">
        <button onClick={saveBusinessConfig} className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-semibold transition hover:opacity-90 shadow-md" style={{ backgroundColor: "var(--theme-button-bg)", color: "var(--theme-button-text)" }}>
          <Save size={15} />
          {configSaved ? "Saved ✓" : "Save Changes"}
        </button>
        <button onClick={resetBusinessConfig} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold transition hover:opacity-70" style={{ borderColor: "#D1D5DB", color: "var(--theme-muted-text)", backgroundColor: "var(--theme-secondary-button-bg)" }}>
          <RotateCcw size={14} />
          Reset Defaults
        </button>
      </div>
      {configSaved && <p className="mt-3 text-sm font-medium" style={{ color: "#16a34a" }}>✅ Configuration saved to database successfully.</p>}
    </div>
  );
};

export default BillingSettings;