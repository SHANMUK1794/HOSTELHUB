import React from "react";
import { Clock, Zap, Settings as SettingsIcon, Save, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI Components
// ─────────────────────────────────────────────────────────────────────────────
const SectionTitle = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-5 pb-2 border-b" style={{ borderColor: "#e5e7eb" }}>
    {Icon && <Icon size={16} style={{ color: "var(--theme-accent)" }} />}
    <h2 className="text-base font-bold" style={{ color: "var(--theme-heading-text)", fontFamily: "var(--theme-font-family-primary)" }}>{children}</h2>
  </div>
);

const FieldRow = ({ label, hint, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 mb-5">
    <div className="w-full sm:w-52 shrink-0">
      <label className="text-sm font-medium block" style={{ color: "var(--theme-primary-text)", fontFamily: "var(--theme-font-family-primary)" }}>{label}</label>
      {hint && <span className="text-xs" style={{ color: "var(--theme-muted-text)" }}>{hint}</span>}
    </div>
    {children}
  </div>
);

const NumberInput = ({ value, onChange, prefix, suffix, min = 0, step = 1 }) => (
  <div className="flex items-center gap-2">
    {prefix && <span className="text-sm font-semibold" style={{ color: "var(--theme-accent)" }}>{prefix}</span>}
    <input type="number" value={value} min={min} step={step} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none font-semibold" style={{ fontFamily: "var(--theme-font-family-primary)", color: "var(--theme-primary-text)", backgroundColor: "var(--theme-filter-bg)" }} />
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
const PayrollSettings = ({ businessConfig, handleBusinessChange, saveBusinessConfig, resetBusinessConfig, configSaved }) => {
  return (
    <div className="max-w-3xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <ConfigSummaryCard label="Working Days/Month" value={businessConfig.workingDaysPerMonth} unit="" icon={Clock} color="#3b82f6" />
        <ConfigSummaryCard label="Hours/Day" value={businessConfig.workingHoursPerDay} unit="" icon={Clock} color="#8b5cf6" />
        <ConfigSummaryCard label="OT Multiplier" value={`${businessConfig.overtimeMultiplier}×`} unit="" icon={Zap} color="#f59e0b" />
      </div>

      <div className="rounded-2xl p-6 shadow-sm border border-gray-100 mb-6" style={{ backgroundColor: "var(--theme-card-bg)" }}>
        <SectionTitle icon={Clock}>Salary Calculation</SectionTitle>
        <FieldRow label="Working Days / Month" hint="Divisor for daily salary">
          <NumberInput value={businessConfig.workingDaysPerMonth} onChange={handleBusinessChange("workingDaysPerMonth")} suffix="days" min={1} step={1} />
        </FieldRow>
        <FieldRow label="Working Hours / Day" hint="Divisor for hourly salary">
          <NumberInput value={businessConfig.workingHoursPerDay} onChange={handleBusinessChange("workingHoursPerDay")} suffix="hours" min={1} step={0.5} />
        </FieldRow>
        <div className="mt-3 p-3 rounded-xl text-sm" style={{ backgroundColor: "var(--theme-filter-bg)", color: "var(--theme-muted-text)" }}>
          <strong style={{ color: "var(--theme-heading-text)" }}>Daily salary:</strong>
          <code className="ml-1 px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: "var(--theme-secondary-card-bg)" }}>Monthly Salary ÷ {businessConfig.workingDaysPerMonth} days</code><br />
          <strong style={{ color: "var(--theme-heading-text)" }}>Hourly rate:</strong>
          <code className="ml-1 px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: "var(--theme-secondary-card-bg)" }}>Daily Salary ÷ {businessConfig.workingHoursPerDay} hours</code>
        </div>
      </div>

      <div className="rounded-2xl p-6 shadow-sm border border-gray-100 mb-6" style={{ backgroundColor: "var(--theme-card-bg)" }}>
        <SectionTitle icon={Zap}>Overtime Rate</SectionTitle>
        <FieldRow label="OT Multiplier" hint="Overtime rate = Hourly rate × multiplier">
          <NumberInput value={businessConfig.overtimeMultiplier} onChange={handleBusinessChange("overtimeMultiplier")} suffix="× hourly rate" min={1} step={0.5} />
        </FieldRow>
        <div className="mt-3 p-4 rounded-xl border" style={{ backgroundColor: "var(--theme-filter-bg)", borderColor: "var(--theme-accent)20" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--theme-heading-text)" }}>Example: ₹15,000/month salary</p>
          <div className="space-y-1 text-sm" style={{ color: "var(--theme-muted-text)" }}>
            <p>Daily rate: <strong style={{ color: "var(--theme-primary-text)" }}>₹{(15000 / businessConfig.workingDaysPerMonth).toFixed(2)}</strong></p>
            <p>Hourly rate: <strong style={{ color: "var(--theme-primary-text)" }}>₹{(15000 / businessConfig.workingDaysPerMonth / businessConfig.workingHoursPerDay).toFixed(2)}</strong></p>
            <p>OT rate ({businessConfig.overtimeMultiplier}×): <strong style={{ color: "var(--theme-accent)" }}>₹{((15000 / businessConfig.workingDaysPerMonth / businessConfig.workingHoursPerDay) * businessConfig.overtimeMultiplier).toFixed(2)} / hr</strong></p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6 shadow-sm border border-gray-100 mb-6" style={{ backgroundColor: "var(--theme-card-bg)" }}>
        <SectionTitle icon={SettingsIcon}>Leave Policy</SectionTitle>
        <FieldRow label="Casual Leave / Month" hint="Number of free CL days before leave deduction applies">
          <NumberInput value={businessConfig.casualLeavePerMonth} onChange={handleBusinessChange("casualLeavePerMonth")} suffix="days" min={0} step={1} />
        </FieldRow>
        <div className="mt-3 p-3 rounded-xl text-sm" style={{ backgroundColor: "var(--theme-filter-bg)", color: "var(--theme-muted-text)" }}>
          Leave beyond CL entitlement is deducted at daily rate.
          <code className="ml-1 px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: "var(--theme-secondary-card-bg)" }}>Leave wages = (actual_leave − CL) × daily_rate</code>
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

export default PayrollSettings;