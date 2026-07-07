import { useState } from "react";
import { useSettings } from "../../hooks/useSettings";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Palette, DollarSign, Clock, MessageCircle } from "lucide-react";
import { useTheme } from "../../hooks/ThemeContext";

// Import your newly split components
import ThemeSettings from "./ThemeSettings";
import BillingSettings from "./BillingSettings";
import PayrollSettings from "./PayrollSettings";
import WhatsAppSettings from "../settings/WhatsAppSettings";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SETTINGS COMPONENT (ROUTER)
// ─────────────────────────────────────────────────────────────────────────────
const Settings = () => {
  const { theme, updateTheme, resetTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("theme");
  
  const { 
    businessConfig, 
    configSaved, 
    handleBusinessChange, 
    saveBusinessConfig, 
    resetBusinessConfig 
  } = useSettings();

  const TABS = [
    { id: "theme", label: "Theme", icon: Palette },
    { id: "billing", label: "Billing & Fees", icon: DollarSign },
    { id: "payroll", label: "Payroll & Staff", icon: Clock },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300" style={{ backgroundColor: "var(--theme-app-bg)", fontFamily: "var(--theme-font-family-primary)" }}>
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-9 h-9 rounded-full hover:opacity-80 transition" style={{ backgroundColor: "var(--theme-secondary-button-bg)" }}>
          <FaArrowLeft style={{ color: "var(--theme-heading-text)" }} />
        </button>
        <div>
          <h1 className="font-bold leading-tight" style={{ color: "var(--theme-heading-text)", fontSize: "var(--theme-font-heading)", fontFamily: "var(--theme-font-family-primary)" }}>Settings</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--theme-muted-text)" }}>Manage appearance and system defaults</p>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex gap-1 mb-8 p-1 rounded-2xl w-fit flex-wrap" style={{ backgroundColor: "var(--theme-secondary-button-bg)", border: "1px solid #e5e7eb" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={ activeTab === id ? { backgroundColor: "var(--theme-button-bg)", color: "var(--theme-button-text)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" } : { backgroundColor: "transparent", color: "var(--theme-muted-text)" } }
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB CONTENT AREA
      ══════════════════════════════════════════════════════════════ */}
      
      {activeTab === "theme" && (
         <ThemeSettings 
           theme={theme} 
           updateTheme={updateTheme} 
           resetTheme={resetTheme} 
         />
      )}

      {activeTab === "billing" && (
        <BillingSettings 
          businessConfig={businessConfig}
          handleBusinessChange={handleBusinessChange}
          saveBusinessConfig={saveBusinessConfig}
          resetBusinessConfig={resetBusinessConfig}
          configSaved={configSaved}
        />
      )}

      {activeTab === "payroll" && (
        <PayrollSettings 
          businessConfig={businessConfig}
          handleBusinessChange={handleBusinessChange}
          saveBusinessConfig={saveBusinessConfig}
          resetBusinessConfig={resetBusinessConfig}
          configSaved={configSaved}
        />
      )}

      {activeTab === "whatsapp" && (
        <div className="max-w-3xl">
          <WhatsAppSettings 
            businessConfig={businessConfig} 
            handleBusinessChange={handleBusinessChange} 
          />
          {/* Note: Save buttons for WhatsApp are rendered here inside the main page 
              so they can access the save functions easily. */}
          <div className="flex items-center gap-4 mt-6">
            <button onClick={saveBusinessConfig} className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-semibold transition hover:opacity-90 shadow-md" style={{ backgroundColor: "var(--theme-button-bg)", color: "var(--theme-button-text)" }}>
              Save Changes
            </button>
            <button onClick={resetBusinessConfig} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold transition hover:opacity-70" style={{ borderColor: "#D1D5DB", color: "var(--theme-muted-text)", backgroundColor: "var(--theme-secondary-button-bg)" }}>
              Reset Defaults
            </button>
          </div>
          {configSaved && <p className="mt-3 text-sm font-medium" style={{ color: "#16a34a" }}>✅ Configuration saved successfully.</p>}
        </div>
      )}

    </div>
  );
};

export default Settings;