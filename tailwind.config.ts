import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base - Night Sky Theme
        background: "#0a0a1a",
        foreground: "#f0f0f5",
        
        // Card
        card: {
          DEFAULT: "#12122a",
          foreground: "#f0f0f5",
        },
        
        // Primary - Polaris Gold
        primary: {
          DEFAULT: "#fbbf24",
          foreground: "#0a0a1a",
        },
        
        // Secondary
        secondary: {
          DEFAULT: "#1e293b",
          foreground: "#f0f0f5",
        },
        
        // Muted
        muted: {
          DEFAULT: "#1e293b",
          foreground: "#94a3b8",
        },
        
        // Accent
        accent: {
          DEFAULT: "#1e3a5f",
          foreground: "#f0f0f5",
        },
        
        // Heat Map Colors
        heat: {
          cold: "#334155",
          warming: "#1e3a5f",
          warm: "#b45309",
          hot: "#f59e0b",
          fire: "#fbbf24",
        },
        
        // Status
        success: "#22c55e",
        warning: "#eab308",
        error: "#ef4444",
        
        // Border & Input
        border: "#1e293b",
        input: "#1e293b",
        ring: "#fbbf24",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #fbbf24, 0 0 10px #fbbf24" },
          "100%": { boxShadow: "0 0 10px #fbbf24, 0 0 20px #fbbf24, 0 0 30px #fbbf24" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
