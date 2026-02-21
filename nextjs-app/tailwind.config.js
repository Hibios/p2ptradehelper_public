import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      height: {
        screen: ['100vh', '100dvh'],
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    prefix: "heroui", // prefix for themes variables
    addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
    defaultTheme: "light", // default theme from the themes object
    defaultExtendTheme: "light", // default theme to extend on custom themes
    layout: {}, // common layout tokens (applied to all themes)
    themes: {
      light: {
        layout: {}, // light theme layout tokens
        colors: {
          primary: {
            DEFAULT: "#10b981",
          },
          secondary: {
            DEFAULT: "#03adee",
          },
          danger: {
            DEFAULT: "#dc2626",
          },
          bgray: {
            DEFAULT: "#1E1E1E",
          },
          standart_border: {
            DEFAULT: "#1E1E1E",
          },
          focus: 'rgba(0, 189, 171, 0.50)',
        }, // light theme colors
      },
      dark: {
        layout: {}, // dark theme layout tokens
        colors: {
          primary: {
            DEFAULT: "#10b981",
          },
          secondary: {
            DEFAULT: "#03adee",
          },
          danger: {
            DEFAULT: "#dc2626",
          },
          bgray: {
            DEFAULT: "#27272a",
          },
          standart_border: {
            DEFAULT: "#3F3F46",
          },
          focus: 'rgba(0, 189, 171, 0.50)',
        }, // dark theme colors
      },
      // ... custom themes
    },
  })],
}
