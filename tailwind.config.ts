import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paddock: {
          bg: "#0E0E10",
          surface: "#151518",
          card: "#18191E",
          hover: "#1F2026",
          border: "#26262B",
          borderMuted: "#1F1F24",
        },
        race: {
          red: "#CE2F2C",
          redDark: "#B52927",
          redHover: "#E53935",
          indigo: "#8F9CF8",
          green: "#2BB673",
          greenGlow: "rgba(43, 182, 115, 0.25)",
          purple: "#B138DD",
          purpleGlow: "rgba(177, 56, 221, 0.25)",
          yellow: "#F5C518",
          muted: "#8A8A93",
        },
      },
      fontFamily: {
        display: [
          '"Barlow Condensed"',
          '"Titillium Web"',
          "-apple-system",
          "BlinkMacSystemFont",
          "Impact",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        sans: [
          '"Inter"',
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "racing-stripes":
          "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.2) 10px, rgba(0, 0, 0, 0.2) 20px)",
        "hazard-stripes":
          "repeating-linear-gradient(-45deg, #F5C518, #F5C518 15px, #151518 15px, #151518 30px)",
        "red-flag-stripes":
          "repeating-linear-gradient(-45deg, #CE2F2C, #CE2F2C 15px, #0E0E10 15px, #0E0E10 30px)",
      },
      keyframes: {
        "speed-wipe": {
          "0%": { transform: "translateX(120%) skewX(-15deg)" },
          "100%": { transform: "translateX(-150%) skewX(-15deg)" },
        },
        "light-flash": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(0.96)" },
        },
        "row-flash": {
          "0%": { backgroundColor: "rgba(43, 182, 115, 0.35)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
      animation: {
        "speed-wipe": "speed-wipe 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "light-flash": "light-flash 1s infinite",
        "row-flash": "row-flash 1.5s ease-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;

