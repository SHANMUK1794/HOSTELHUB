import React, { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Palette,
  Settings as SettingsIcon,
} from "lucide-react";
import { defaultTheme } from "../../hooks/ThemeContext";

// ─────────────────────────────────────────────────────────────────────────────
// PRESET THEMES DATA
// ─────────────────────────────────────────────────────────────────────────────
const PRESET_THEMES = [
  {
    id: "hostelhub-teal",
    name: "HostelHub Teal",
    description: "Official brand — teal #0d9488",

    preview: {
      sidebar: "#0f172a",
      card: "#ffffff",
      cardEnd: "#f1f5f9",
      accent: "#0d9488",
      text: "#1e293b",
      bg: "#f8fafc",
      tableHeader: "#0f172a",
      filterBg: "#ccfbf1",
    },
    theme: {
      appBg: "#f8fafc",
      cardBg: "#ffffff",
      cardBgLinear1: "#ffffff",
      cardBgLinear2: "#f1f5f9",
      secondaryCardBg: "#f1f5f9",
      sidebarBg: "#0f172a",
      buttonBg: "#0d9488",
      secondaryButtonBg: "#f0fdfa",
      tableHeaderBg: "#0f172a",
      tableRowBg: "#ffffff",
      filterBg: "#ccfbf1",
      primaryText: "#1e293b",
      headingText: "#0f172a",
      buttonText: "#ffffff",
      secondaryButtonText: "#0d9488",
      mutedText: "#64748b",
      whiteText: "#ffffff",
      iconColor: "#0d9488",
      accent: "#0d9488",
      accentHover: "#0f766e",
      logo: "HostelHub",
      bannerImage: "",
      heroImage: "",
      fontSize: { ...defaultTheme.fontSize },
      fontFamily: { ...defaultTheme.fontFamily },
      darkMode: false,
      images: {
        birthday:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/CakeBlue.png",
        complaints:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/ComplaintsBlue.png",
        certificates:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/CertificateBlue.png",
        kitchen:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/KitchenBlue.png",
        storeRoom:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/StoreRoomBlue.png",
        mail: "https://asset.techjose.com/Hostelos/NewImages/BlueMail.png",
        kitchenLanding:
          "https://asset.techjose.com/Hostelos/NewImages/Bluebro.png",
        notification:
          "https://asset.techjose.com/Hostelos/Toast/BlueNotification.png",
      },
    },
  },
  {
    id: "hostelhub-orange",
    name: "HostelHub Orange",
    description: "Warm orange — #EA6A12",
    preview: {
      sidebar: "#EA6A12",
      card: "#FFFFFF",
      cardEnd: "#FFE5D1",
      accent: "#EA6A12",
      text: "#303030",
      bg: "#FDFBF7",
      tableHeader: "#EA6A12",
      filterBg: "#FFF5EE",
    },
    theme: {
      appBg: "#FDFBF7",
      cardBg: "#FFFFFF",
      cardBgLinear1: "#FFFFFF",
      cardBgLinear2: "#FFE5D1",
      secondaryCardBg: "#FFE5D1",
      sidebarBg: "#EA6A12",
      buttonBg: "#EA6A12",
      secondaryButtonBg: "#FFF5EE",
      tableHeaderBg: "#EA6A12",
      tableRowBg: "#FFFFFF",
      filterBg: "#FFF5EE",
      primaryText: "#303030",
      headingText: "#EA6A12",
      buttonText: "#FFFFFF",
      secondaryButtonText: "#EA6A12",
      mutedText: "#6B7280",
      whiteText: "#FFFFFF",
      iconColor: "#EA6A12",
      accent: "#EA6A12",
      accentHover: "#d95a0e",
      logo: "HostelHub",
      bannerImage: "",
      heroImage: "",
      fontSize: { ...defaultTheme.fontSize },
      fontFamily: { ...defaultTheme.fontFamily },
      darkMode: false,
      images: {
        birthday: "https://asset.techjose.com/Hostelos/dasboardImg/cake.png",
        complaints:
          "https://asset.techjose.com/Hostelos/dasboardImg/clipboard.png",
        certificates:
          "https://asset.techjose.com/Hostelos/dasboardImg/fassai.png",
        kitchen:
          "https://asset.techjose.com/Hostelos/dasboardImg/kitchenpot.png",
        storeRoom: "https://asset.techjose.com/Hostelos/dasboardImg/store.png",
        mail: "https://asset.techjose.com/Hostelos/Birthday-Reminders/Mail-sent.png",
        kitchenLanding:
          "https://asset.techjose.com/Hostelos/Kitchen/loading-time-image.png",
        notification:
          "https://asset.techjose.com/Hostelos/Header/Notification.png",
      },
    },
  },
  {
    id: "navy-deep",
    name: "Navy Deep",
    description: "Deeper navy + lavender",
    preview: {
      sidebar: "#1B2D5B",
      card: "#EEF1FB",
      cardEnd: "#C5CFF0",
      accent: "#1B2D5B",
      text: "#1A2340",
      bg: "#E8EBF5",
      tableHeader: "#1B2D5B",
      filterBg: "#EEF1FB",
    },
    theme: {
      appBg: "#E8EBF5",
      cardBg: "#EEF1FB",
      cardBgLinear1: "#EEF1FB",
      cardBgLinear2: "#C5CFF0",
      secondaryCardBg: "#C5CFF0",
      sidebarBg: "#1B2D5B",
      buttonBg: "#1B2D5B",
      secondaryButtonBg: "#EEF1FB",
      tableHeaderBg: "#1B2D5B",
      tableRowBg: "#FFFFFF",
      filterBg: "#EEF1FB",
      primaryText: "#1A2340",
      headingText: "#1B2D5B",
      buttonText: "#FFFFFF",
      secondaryButtonText: "#1B2D5B",
      mutedText: "#6B7280",
      whiteText: "#FFFFFF",
      iconColor: "#1B2D5B",
      accent: "#1B2D5B",
      accentHover: "#102040",
      logo: "https://asset.techjose.com/Hostelos/SidebarHeader.png",
      bannerImage: "https://asset.techjose.com/Hostelos/dasboardImg/banner.jpg",
      heroImage: "https://asset.techjose.com/Hostelos/dasboardImg/banner.jpg",
      fontSize: { ...defaultTheme.fontSize },
      fontFamily: { ...defaultTheme.fontFamily },
      darkMode: false,
      images: {
        birthday:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/CakeBlue.png",
        complaints:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/ComplaintsBlue.png",
        certificates:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/CertificateBlue.png",
        kitchen:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/KitchenBlue.png",
        storeRoom:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/StoreRoomBlue.png",
        mail: "https://asset.techjose.com/Hostelos/NewImages/BlueMail.png",
        kitchenLanding:
          "https://asset.techjose.com/Hostelos/NewImages/Bluebro.png",
        notification:
          "https://asset.techjose.com/Hostelos/Toast/BlueNotification.png",
      },
    },
  },
  {
    id: "steel-blue",
    name: "Steel Blue",
    description: "Lighter steel blue — airy",
    preview: {
      sidebar: "#3A5FA0",
      card: "#FFFFFF",
      cardEnd: "#D0DCFF",
      accent: "#3A5FA0",
      text: "#1E2E50",
      bg: "#F0F4FF",
      tableHeader: "#3A5FA0",
      filterBg: "#EAF0FF",
    },
    theme: {
      appBg: "#F0F4FF",
      cardBg: "#FFFFFF",
      cardBgLinear1: "#FFFFFF",
      cardBgLinear2: "#D0DCFF",
      secondaryCardBg: "#D0DCFF",
      sidebarBg: "#3A5FA0",
      buttonBg: "#3A5FA0",
      secondaryButtonBg: "#EAF0FF",
      tableHeaderBg: "#3A5FA0",
      tableRowBg: "#FFFFFF",
      filterBg: "#EAF0FF",
      primaryText: "#1E2E50",
      headingText: "#3A5FA0",
      buttonText: "#FFFFFF",
      secondaryButtonText: "#3A5FA0",
      mutedText: "#6B7280",
      whiteText: "#FFFFFF",
      iconColor: "#3A5FA0",
      accent: "#3A5FA0",
      accentHover: "#2A4A88",
      logo: "https://asset.techjose.com/Hostelos/SidebarHeader.png",
      bannerImage: "https://asset.techjose.com/Hostelos/dasboardImg/banner.jpg",
      heroImage: "https://asset.techjose.com/Hostelos/dasboardImg/banner.jpg",
      fontSize: { ...defaultTheme.fontSize },
      fontFamily: { ...defaultTheme.fontFamily },
      darkMode: false,
      images: {
        birthday:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/CakeBlue.png",
        complaints:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/ComplaintsBlue.png",
        certificates:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/CertificateBlue.png",
        kitchen:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/KitchenBlue.png",
        storeRoom:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/StoreRoomBlue.png",
        mail: "https://asset.techjose.com/Hostelos/NewImages/BlueMail.png",
        kitchenLanding:
          "https://asset.techjose.com/Hostelos/NewImages/Bluebro.png",
        notification:
          "https://asset.techjose.com/Hostelos/Toast/BlueNotification.png",
      },
    },
  },
  {
    id: "slate-teal",
    name: "Slate Teal",
    description: "Cool teal — fresh, professional",
    preview: {
      sidebar: "#1E4D5C",
      card: "#FFFFFF",
      cardEnd: "#B8DCEA",
      accent: "#1E4D5C",
      text: "#1A3040",
      bg: "#EAF4F7",
      tableHeader: "#1E4D5C",
      filterBg: "#DDF0F5",
    },
    theme: {
      appBg: "#EAF4F7",
      cardBg: "#FFFFFF",
      cardBgLinear1: "#FFFFFF",
      cardBgLinear2: "#B8DCEA",
      secondaryCardBg: "#B8DCEA",
      sidebarBg: "#1E4D5C",
      buttonBg: "#1E4D5C",
      secondaryButtonBg: "#DDF0F5",
      tableHeaderBg: "#1E4D5C",
      tableRowBg: "#FFFFFF",
      filterBg: "#DDF0F5",
      primaryText: "#1A3040",
      headingText: "#1E4D5C",
      buttonText: "#FFFFFF",
      secondaryButtonText: "#1E4D5C",
      mutedText: "#6B7280",
      whiteText: "#FFFFFF",
      iconColor: "#1E4D5C",
      accent: "#1E4D5C",
      accentHover: "#153845",
      logo: "https://asset.techjose.com/Hostelos/SidebarHeader.png",
      bannerImage: "https://asset.techjose.com/Hostelos/dasboardImg/banner.jpg",
      heroImage: "https://asset.techjose.com/Hostelos/dasboardImg/banner.jpg",
      fontSize: { ...defaultTheme.fontSize },
      fontFamily: { ...defaultTheme.fontFamily },
      darkMode: false,
      images: {
        birthday:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/CakeBlue.png",
        complaints:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/ComplaintsBlue.png",
        certificates:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/CertificateBlue.png",
        kitchen:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/KitchenBlue.png",
        storeRoom:
          "https://asset.techjose.com/Hostelos/NewImages/DashboardImages/StoreRoomBlue.png",
        mail: "https://asset.techjose.com/Hostelos/NewImages/BlueMail.png",
        kitchenLanding:
          "https://asset.techjose.com/Hostelos/NewImages/Bluebro.png",
        notification:
          "https://asset.techjose.com/Hostelos/Toast/BlueNotification.png",
      },
    },
  },
];

const FONT_OPTIONS = [
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: "Nunito, sans-serif", label: "Nunito" },
  { value: "DM Sans, sans-serif", label: "DM Sans" },
];

const FONT_SIZE_OPTIONS = [
  "12px",
  "13px",
  "14px",
  "15px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
].map((v) => ({ value: v, label: v }));

// ─────────────────────────────────────────────────────────────────────────────
// Shared Components for Theme Tab
// ─────────────────────────────────────────────────────────────────────────────
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

const FieldRow = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 mb-5">
    <div className="w-full sm:w-52 shrink-0">
      <label
        className="text-sm font-medium block"
        style={{
          color: "var(--theme-primary-text)",
          fontFamily: "var(--theme-font-family-primary)",
        }}
      >
        {label}
      </label>
    </div>
    {children}
  </div>
);

const ColorInput = ({ value, onChange }) => (
  <div className="flex items-center gap-3">
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-32 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none"
      style={{
        fontFamily: "var(--theme-font-family-primary)",
        color: "var(--theme-primary-text)",
        backgroundColor: "var(--theme-filter-bg)",
      }}
      maxLength={7}
    />
  </div>
);

const SelectInput = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none w-full sm:w-64"
    style={{
      fontFamily: "var(--theme-font-family-primary)",
      color: "var(--theme-primary-text)",
      backgroundColor: "var(--theme-filter-bg)",
    }}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

const ThemeCard = ({ preset, isSelected, onSelect }) => {
  const { preview, name, description } = preset;
  return (
    <button
      onClick={() => onSelect(preset)}
      className="relative w-full text-left rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none"
      style={{
        border: isSelected
          ? `2px solid ${preview.accent}`
          : "2px solid #e5e7eb",
        boxShadow: isSelected
          ? `0 0 0 2px ${preview.accent}30, 0 4px 20px rgba(0,0,0,0.12)`
          : "0 2px 8px rgba(0,0,0,0.08)",
        transform: isSelected ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div
        className="flex h-28 overflow-hidden"
        style={{ backgroundColor: preview.bg }}
      >
        <div
          className="w-10 flex-shrink-0 flex flex-col gap-1.5 p-1.5 pt-2"
          style={{ backgroundColor: preview.sidebar }}
        >
          <div className="w-5 h-1.5 rounded-sm bg-white opacity-90 mb-0.5" />
          {[0.8, 0.5, 0.5, 0.5].map((op, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <div
                className="w-1.5 h-1.5 rounded-sm"
                style={{ backgroundColor: "#FFFFFF", opacity: op }}
              />
              <div
                className="flex-1 h-0.5 rounded-full"
                style={{ backgroundColor: "#FFFFFF", opacity: op * 0.7 }}
              />
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col p-1.5 gap-1 overflow-hidden">
          <div
            className="w-full h-4 rounded flex items-center px-1.5 gap-1.5 flex-shrink-0"
            style={{
              backgroundColor: preview.card,
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              className="w-12 h-1 rounded-full"
              style={{ backgroundColor: preview.accent, opacity: 0.7 }}
            />
            <div
              className="ml-auto w-4 h-2.5 rounded"
              style={{ backgroundColor: preview.accent }}
            />
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 rounded p-1"
                style={{
                  background:
                    i === 0
                      ? `linear-gradient(to right, ${preview.card}, ${preview.cardEnd})`
                      : preview.card,
                  border: "1px solid #e5e7eb",
                }}
              >
                <div
                  className="w-full h-0.5 rounded-full mb-0.5"
                  style={{ backgroundColor: preview.accent, opacity: 0.8 }}
                />
                <div
                  className="w-6 h-1 rounded-full"
                  style={{ backgroundColor: preview.text, opacity: 0.4 }}
                />
              </div>
            ))}
          </div>
          <div
            className="flex-1 rounded overflow-hidden"
            style={{ border: "1px solid #e5e7eb" }}
          >
            <div
              className="w-full h-3.5 flex items-center px-1 gap-1.5"
              style={{ backgroundColor: preview.tableHeader }}
            >
              {[30, 50, 40].map((w, i) => (
                <div
                  key={i}
                  className="h-0.5 rounded-full bg-white opacity-80"
                  style={{ width: w }}
                />
              ))}
            </div>
            {[0, 1].map((i) => (
              <div
                key={i}
                className="w-full h-3 flex items-center px-1 gap-1.5"
                style={{
                  backgroundColor:
                    i % 2 === 0 ? preview.card : preview.filterBg,
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                {[30, 50, 40].map((w, j) => (
                  <div
                    key={j}
                    className="h-0.5 rounded-full"
                    style={{
                      width: w,
                      backgroundColor: preview.text,
                      opacity: 0.4,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="px-3 py-2.5 flex items-center justify-between"
        style={{
          backgroundColor: preview.card,
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <div>
          <p
            className="font-semibold text-xs leading-tight"
            style={{
              color: preview.accent,
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {name}
          </p>
          <p
            className="text-xs mt-0.5 leading-tight"
            style={{ color: "#6B7280" }}
          >
            {description}
          </p>
        </div>
        {isSelected && (
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-2"
            style={{ backgroundColor: preview.accent }}
          >
            <Check size={10} color="#FFFFFF" strokeWidth={3} />
          </div>
        )}
      </div>
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main ThemeSettings Component
// ─────────────────────────────────────────────────────────────────────────────
const ThemeSettings = ({ theme, updateTheme, resetTheme }) => {
  const [showCustomize, setShowCustomize] = useState(false);

  const handleSelectPreset = (preset) =>
    updateTheme({ ...preset.theme, id: preset.id });
  const handleColor = (key) => (val) => updateTheme({ [key]: val });
  const handleFontSize = (key) => (val) =>
    updateTheme({ fontSize: { [key]: val } });
  const handleFontFamily = (key) => (val) =>
    updateTheme({ fontFamily: { [key]: val } });
  const handleImage = (key) => (val) => updateTheme({ [key]: val });

  const selectedPreset = PRESET_THEMES.find((p) => p.id === theme.id);

  return (
    <div>
      <p
        className="text-xs uppercase tracking-widest font-semibold mb-4"
        style={{ color: "var(--theme-muted-text)" }}
      >
        Select a theme
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {PRESET_THEMES.map((preset) => (
          <ThemeCard
            key={preset.id}
            preset={preset}
            isSelected={theme.id === preset.id}
            onSelect={handleSelectPreset}
          />
        ))}
      </div>

      {selectedPreset && (
        <div
          className="mt-6 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            backgroundColor: "var(--theme-card-bg)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ backgroundColor: "var(--theme-button-bg)" }}
            >
              <Check size={14} color="#FFFFFF" strokeWidth={3} />
            </div>
            <div>
              <p
                className="font-semibold text-sm"
                style={{ color: "var(--theme-heading-text)" }}
              >
                {selectedPreset.name} applied
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--theme-muted-text)" }}
              >
                Your workspace is now using this theme
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetTheme();
                setShowCustomize(false);
              }}
              className="text-sm px-4 py-2 rounded-xl border transition hover:opacity-70 font-medium"
              style={{
                borderColor: "#D1D5DB",
                color: "var(--theme-muted-text)",
                backgroundColor: "var(--theme-secondary-button-bg)",
              }}
            >
              Reset
            </button>
            <button
              onClick={() => setShowCustomize((v) => !v)}
              className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
            >
              <Palette size={15} /> Customize{" "}
              {showCustomize ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
          </div>
        </div>
      )}

      {showCustomize && (
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div
              className="rounded-2xl p-6 shadow-sm border border-gray-100"
              style={{ backgroundColor: "var(--theme-card-bg)" }}
            >
              <SectionTitle icon={Palette}>Background Colors</SectionTitle>
              {[
                ["App Background", "appBg"],
                ["Card BG", "cardBg"],
                ["Card Linear 1", "cardBgLinear1"],
                ["Card Linear 2", "cardBgLinear2"],
                ["Secondary Card", "secondaryCardBg"],
                ["Sidebar BG", "sidebarBg"],
                ["Button BG", "buttonBg"],
                ["Secondary Button", "secondaryButtonBg"],
                ["Table Header", "tableHeaderBg"],
                ["Filter BG", "filterBg"],
              ].map(([label, key]) => (
                <FieldRow key={key} label={label}>
                  <ColorInput value={theme[key]} onChange={handleColor(key)} />
                </FieldRow>
              ))}
            </div>

            <div
              className="rounded-2xl p-6 shadow-sm border border-gray-100"
              style={{ backgroundColor: "var(--theme-card-bg)" }}
            >
              <SectionTitle icon={Palette}>Text & Icon Colors</SectionTitle>
              {[
                ["Primary Text", "primaryText"],
                ["Heading Text", "headingText"],
                ["Button Text", "buttonText"],
                ["Secondary Btn Text", "secondaryButtonText"],
                ["Muted Text", "mutedText"],
                ["Icon Color", "iconColor"],
                ["Accent Color", "accent"],
                ["Accent Hover", "accentHover"],
              ].map(([label, key]) => (
                <FieldRow key={key} label={label}>
                  <ColorInput value={theme[key]} onChange={handleColor(key)} />
                </FieldRow>
              ))}
            </div>

            <div
              className="rounded-2xl p-6 shadow-sm border border-gray-100"
              style={{ backgroundColor: "var(--theme-card-bg)" }}
            >
              <SectionTitle icon={SettingsIcon}>Font Family</SectionTitle>
              <FieldRow label="Primary Font">
                <SelectInput
                  value={theme.fontFamily.primary}
                  onChange={handleFontFamily("primary")}
                  options={FONT_OPTIONS}
                />
              </FieldRow>
              <FieldRow label="Secondary Font">
                <SelectInput
                  value={theme.fontFamily.secondary}
                  onChange={handleFontFamily("secondary")}
                  options={FONT_OPTIONS}
                />
              </FieldRow>
            </div>

            <div
              className="rounded-2xl p-6 shadow-sm border border-gray-100"
              style={{ backgroundColor: "var(--theme-card-bg)" }}
            >
              <SectionTitle icon={SettingsIcon}>Font Sizes</SectionTitle>
              {[
                ["Heading", "heading"],
                ["Sub-Heading", "subHeading"],
                ["Card Title", "cardTitle"],
                ["Body", "body"],
                ["Small", "small"],
                ["Extra Small", "xs"],
              ].map(([label, key]) => (
                <FieldRow key={key} label={label}>
                  <SelectInput
                    value={theme.fontSize[key]}
                    onChange={handleFontSize(key)}
                    options={FONT_SIZE_OPTIONS}
                  />
                </FieldRow>
              ))}
            </div>

            <div
              className="rounded-2xl p-6 shadow-sm border border-gray-100"
              style={{ backgroundColor: "var(--theme-card-bg)" }}
            >
              <SectionTitle icon={SettingsIcon}>Logo & Banner</SectionTitle>
              <FieldRow label="Logo URL">
                <input
                  type="text"
                  value={theme.logo}
                  onChange={(e) => handleImage("logo")(e.target.value)}
                  placeholder="https://..."
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none w-full sm:w-64"
                  style={{
                    fontFamily: "var(--theme-font-family-primary)",
                    color: "var(--theme-primary-text)",
                    backgroundColor: "var(--theme-filter-bg)",
                  }}
                />
              </FieldRow>
              <FieldRow label="Banner URL">
                <input
                  type="text"
                  value={theme.bannerImage}
                  onChange={(e) => handleImage("bannerImage")(e.target.value)}
                  placeholder="https://..."
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none w-full sm:w-64"
                  style={{
                    fontFamily: "var(--theme-font-family-primary)",
                    color: "var(--theme-primary-text)",
                    backgroundColor: "var(--theme-filter-bg)",
                  }}
                />
              </FieldRow>
            </div>

            <div className="flex gap-4 pb-8">
              <button
                onClick={() => {
                  resetTheme();
                  setShowCustomize(false);
                }}
                className="px-6 py-2.5 rounded-xl border font-semibold transition hover:opacity-80"
                style={{
                  borderColor: "var(--theme-accent)",
                  color: "var(--theme-accent)",
                }}
              >
                Reset Defaults
              </button>
              <button
                onClick={() => setShowCustomize(false)}
                className="px-6 py-2.5 rounded-xl font-semibold transition hover:opacity-80"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                }}
              >
                Done
              </button>
            </div>
          </div>

          <div className="xl:col-span-1">
            <div
              className="sticky top-6 rounded-2xl p-6 shadow-sm border border-gray-100"
              style={{ backgroundColor: "var(--theme-card-bg)" }}
            >
              <SectionTitle>Live Preview</SectionTitle>
              <div
                className="rounded-xl p-3 mb-3 flex items-center gap-2"
                style={{ backgroundColor: "var(--theme-sidebar-bg)" }}
              >
                <img
                  src={theme.logo}
                  alt="logo"
                  className="h-7 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span
                  className="font-bold text-sm"
                  style={{ color: "var(--theme-white-text)" }}
                >
                  Hostelos
                </span>
              </div>
              <button
                className="w-full py-2 rounded-lg font-semibold text-sm mb-2"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                }}
              >
                Primary Button
              </button>
              <button
                className="w-full py-2 rounded-lg font-semibold text-sm border mb-3"
                style={{
                  backgroundColor: "var(--theme-secondary-button-bg)",
                  color: "var(--theme-secondary-button-text)",
                  borderColor: "var(--theme-accent)",
                }}
              >
                Secondary Button
              </button>
              <div
                className="rounded-xl p-3 mb-3"
                style={{
                  background:
                    "linear-gradient(to right, var(--theme-card-bg-linear1), var(--theme-card-bg-linear2))",
                }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: "var(--theme-heading-text)" }}
                >
                  Card Title
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  Sample content.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSettings;
