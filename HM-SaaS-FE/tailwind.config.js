/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryLiteBg: "var(--color-primaryLiteBg)",
        secondaryLiteBg: "var(--color-secondaryLiteBg)",
        sideBarLiteBg: "var(--color-sideBarLiteBg)",

        black: "var(--color-black)",
        white: "var(--color-white)",
        white2: "var(--color-white2)",
        red: "var(--color-red)",
        green: "var(--color-green)",
        liteGreen: "var(--color-liteGreen)",
        liteBlue: "var(--color-liteBlue)",
        darkBlue: "var(--color-darkBlue)",
        liteBlack: "var(--color-liteBlack)",
        liteBlack2: "var(--color-liteBlack2)",
        modalBg: "var(--color-modalBg)",
        violet: "var(--color-violet)",
      },
      fontSize: {
        xl: ["1rem", { lineHeight: "1" }],
        "1xl": ["2rem", { lineHeight: "1" }],
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', "sans-serif"],
        sourceSans: ['"Source Sans Pro"', "sans-serif"],
        playfair: ['"Playfair Display"', "serif"],
        jkabode: ["JK Abode", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        spartan: ['"League Spartan"', "sans-serif"],
        righteous: ["Righteous", "cursive"],

        // ADD THIS
        montserrat: ['"Montserrat"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
