import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        border: "var(--border)",
        ring: "var(--ring)",
        danger: "var(--danger)",
        "danger-foreground": "var(--danger-foreground)",
        warning: "var(--warning)",
        navy: "var(--navy)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(232,68,109,0.08)",
        "card-hover": "0 4px 24px 0 rgba(232,68,109,0.14)",
        glow: "0 0 24px 6px rgba(232,68,109,0.25)",
        "glow-green": "0 0 18px 4px rgba(76,175,80,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
