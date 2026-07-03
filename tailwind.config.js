/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      "heading1-bold": [
        "36px",
        {
          lineHeight: "100%",
          fontWeight: "700",
        },
      ],
      "heading2-bold": [
        "30px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "heading3-bold": [
        "24px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "heading4-bold": [
        "20px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "body-bold": [
        "18px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "body-normal": [
        "18px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "base-bold": [
        "16px",
        {
          lineHeight: "140%",
          fontWeight: "600",
        },
      ],
      "small-bold": [
        "14px",
        {
          lineHeight: "140%",
          fontWeight: "600",
        },
      ],
      "small-semibold": [
        "14px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "subtle-medium": [
        "12px",
        {
          lineHeight: "16px",
          fontWeight: "500",
        },
      ],
      "tiny-medium": [
        "10px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "x-small-semibold": [
        "7px",
        {
          lineHeight: "9.318px",
          fontWeight: "600",
        },
      ],
    },
    extend: {
      colors: {
        "purple-1": "#7857FF",
        "purple-2": "#1D1928",
        "pink-1": "#FF0073",
        "light-1": "#FFFFFF",
        "light-2": "#808080",
        "light-3": "#8A8598",
        "dark-1": "#1D1928",
        "dark-2": "#241F30",
        "blue-1": "#016FD5",

        "base-0": "#100D16",
        "base-1": "#14111C",
        "surface-1": "#1D1928",
        "surface-2": "#241F30",
        "surface-3": "#2A2536",
        "surface-4": "#34303E",
        "ink-1": "#FFFFFF",
        "ink-2": "#C3BED2",
        "ink-3": "#8A8598",
        "ink-4": "#5C5869",

        success: "#58D06A",
        warning: "#FFB23C",
        danger: "#FF3B5C",
        info: "#2AA7FF",

        fire: { DEFAULT: "#FF5436", from: "#FF7A3C", to: "#FF2D55" },
        water: { DEFAULT: "#2AA7FF", from: "#38C6FF", to: "#2A6BFF" },
        ice: { DEFAULT: "#66E0D8", from: "#A8F0FF", to: "#5AD1E6", ink: "#0C3A40" },
        earth: { DEFAULT: "#58D06A", from: "#8BE85A", to: "#28B45E", ink: "#08320F" },
        cloud: { DEFAULT: "#B49BFF", from: "#D6C7FF", to: "#9A7CFF", ink: "#2A1B55" },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "yv-shimmer": {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "yv-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        "yv-breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
        "yv-eq": {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        "yv-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "yv-pop": {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "yv-shimmer": "yv-shimmer 1.4s linear infinite",
        "yv-pulse": "yv-pulse 1.8s ease-out infinite",
        "yv-breathe": "yv-breathe 2.4s ease-in-out infinite",
        "yv-eq": "yv-eq 0.9s ease-in-out infinite",
        "yv-float": "yv-float 3s ease-in-out infinite",
        "yv-pop": "yv-pop 0.35s ease-out",
      },
    },
  },
  plugins: [],
}
