import React, { createContext, useState, useEffect, useContext } from "react";

// ─────────────────────────────────────────────
// DEFAULT THEME  (matches your brand: #263765 navy, #F6F8FF light)
// ─────────────────────────────────────────────

export const defaultTheme = {
  // ── Background colors ──
  id: "hostelhub-teal",
  appBg: "#F2F2F2",
  cardBg: "#FFFFFF",
  cardBgLinear1: "#FFFFFF",
  cardBgLinear2: "#AFBEE4",
  secondaryCardBg: "#AFBEE4",
  sidebarBg: "#115e59",
  buttonBg: "#0f766e",
  secondaryButtonBg: "#ccfbf1",
  tableHeaderBg: "#115e59",
  tableRowBg: "#FFFFFF",
  filterBg: "#ccfbf1",

  // ── Text colors ──
  primaryText: "#303030",
  headingText: "#115e59",
  buttonText: "#FFFFFF",
  secondaryButtonText: "#0f766e",
  mutedText: "#6B7280",
  whiteText: "#FFFFFF",

  // ── Icon / accent ──
  iconColor: "#0f766e",
  accent: "#0f766e",
  accentHover: "#115e59",

  // ── Images ──
  logo: "HostelHub",
  bannerImage: "",
  heroImage: "",

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
    kitchenLanding: "https://asset.techjose.com/Hostelos/NewImages/Bluebro.png",
    notification:
      "https://asset.techjose.com/Hostelos/Toast/BlueNotification.png",
  },

  // ── Font sizes ──
  fontSize: {
    heading: "32px",
    subHeading: "24px",
    cardTitle: "17px",
    body: "16px",
    small: "14px",
    xs: "12px",
  },

  // ── Font family ──
  fontFamily: {
    primary: "Montserrat, sans-serif",
    secondary: "Inter, sans-serif",
  },

  darkMode: false,
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const loadSavedTheme = () => {
    try {
      const saved = localStorage.getItem("themeSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultTheme,
          ...parsed,
          fontSize: { ...defaultTheme.fontSize, ...(parsed.fontSize || {}) },
          fontFamily: {
            ...defaultTheme.fontFamily,
            ...(parsed.fontFamily || {}),
          },
          images: { ...defaultTheme.images, ...(parsed.images || {}) },
        };
      }
    } catch {}
    return defaultTheme;
  };

  const [theme, setTheme] = useState(loadSavedTheme);

  const toggleTheme = () => {
    setTheme((prev) => {
      const updated = { ...prev, darkMode: !prev.darkMode };
      localStorage.setItem("themeSettings", JSON.stringify(updated));
      return updated;
    });
  };

  const updateTheme = (newValues) => {
    setTheme((prev) => {
      const updated = {
        ...prev,
        ...newValues,
        fontSize: { ...prev.fontSize, ...(newValues.fontSize || {}) },
        fontFamily: { ...prev.fontFamily, ...(newValues.fontFamily || {}) },
        images: { ...prev.images, ...(newValues.images || {}) },
      };
      localStorage.setItem("themeSettings", JSON.stringify(updated));
      return updated;
    });
  };

  const resetTheme = () => {
    localStorage.removeItem("themeSettings");
    setTheme(defaultTheme);
  };

  useEffect(() => {
    if (theme.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme.darkMode]);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--theme-app-bg", theme.appBg);
    r.style.setProperty("--theme-card-bg", theme.cardBg);
    r.style.setProperty("--theme-card-bg-linear1", theme.cardBgLinear1);
    r.style.setProperty("--theme-card-bg-linear2", theme.cardBgLinear2);
    r.style.setProperty("--theme-secondary-card-bg", theme.secondaryCardBg);
    r.style.setProperty("--theme-sidebar-bg", theme.sidebarBg);
    r.style.setProperty("--theme-button-bg", theme.buttonBg);
    r.style.setProperty("--theme-secondary-button-bg", theme.secondaryButtonBg);
    r.style.setProperty("--theme-table-header-bg", theme.tableHeaderBg);
    r.style.setProperty("--theme-table-row-bg", theme.tableRowBg);
    r.style.setProperty("--theme-filter-bg", theme.filterBg);
    r.style.setProperty("--theme-primary-text", theme.primaryText);
    r.style.setProperty("--theme-heading-text", theme.headingText);
    r.style.setProperty("--theme-button-text", theme.buttonText);
    r.style.setProperty(
      "--theme-secondary-button-text",
      theme.secondaryButtonText,
    );
    r.style.setProperty("--theme-muted-text", theme.mutedText);
    r.style.setProperty("--theme-white-text", theme.whiteText);
    r.style.setProperty("--theme-icon-color", theme.iconColor);
    r.style.setProperty("--theme-accent", theme.accent);
    r.style.setProperty("--theme-accent-hover", theme.accentHover);
    r.style.setProperty("--theme-font-heading", theme.fontSize.heading);
    r.style.setProperty("--theme-font-subheading", theme.fontSize.subHeading);
    r.style.setProperty("--theme-font-card-title", theme.fontSize.cardTitle);
    r.style.setProperty("--theme-font-body", theme.fontSize.body);
    r.style.setProperty("--theme-font-small", theme.fontSize.small);
    r.style.setProperty("--theme-font-xs", theme.fontSize.xs);
    r.style.setProperty(
      "--theme-font-family-primary",
      theme.fontFamily.primary,
    );
    r.style.setProperty(
      "--theme-font-family-secondary",
      theme.fontFamily.secondary,
    );
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, updateTheme, resetTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
