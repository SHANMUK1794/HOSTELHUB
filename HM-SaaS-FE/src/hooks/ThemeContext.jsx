import React, { createContext, useState, useEffect, useContext } from "react";

// ─────────────────────────────────────────────
// DEFAULT THEME  (matches your brand: #263765 navy, #F6F8FF light)
// ─────────────────────────────────────────────

export const defaultTheme = {
  // ── Background colors ──
  id: "hostelhub-teal",
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

  // ── Text colors ──
  primaryText: "#1e293b",
  headingText: "#0f172a",
  buttonText: "#ffffff",
  secondaryButtonText: "#0d9488",
  mutedText: "#64748b",
  whiteText: "#ffffff",

  // ── Icon / accent ──
  iconColor: "#0f766e",
  accent: "#0f766e",
  accentHover: "#115e59",

  // ── Images ──
  logo: "HostelHub",
  bannerImage: "",
  heroImage: "",

  images: {
    birthday: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8'/><path d='M4 16h16'/><path d='M10 9V5a2 2 0 0 1 4 0v4'/><circle cx='12' cy='3' r='1'/></svg>",
    complaints: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><rect x='8' y='2' width='8' height='4' rx='1' ry='1'/><path d='M9 14h6'/><path d='M9 18h6'/><path d='M9 10h3'/></svg>",
    certificates: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><path d='M12 8v4'/><path d='M12 16h.01'/></svg>",
    kitchen: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 18h12a2 2 0 0 0 2-2v-5H4v5a2 2 0 0 0 2 2z'/><path d='M2 11h20'/><path d='M12 2v6'/><circle cx='12' cy='2' r='1'/></svg>",
    storeRoom: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'/><path d='M3.27 6.96L12 12.01l8.73-5.05'/><path d='M12 22.08V12'/></svg>",
    mail: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='4' width='20' height='16' rx='2'/><path d='M22 6l-10 7L2 6'/></svg>",
    kitchenLanding: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/><path d='M2 12h20'/></svg>",
    notification: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'/><path d='M13.73 21a2 2 0 0 1-3.46 0'/></svg>",
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
