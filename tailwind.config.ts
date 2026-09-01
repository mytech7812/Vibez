import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0B0B0E",
          soft: "#121216",
        },
        surface: {
          DEFAULT: "#17171C",
          raised: "#1E1E25",
          line: "#2A2A33",
        },
        ink: {
          DEFAULT: "#F4F3EF",
          muted: "#A7A6B3",
          faint: "#6E6D7A",
        },
        signal: {
          DEFAULT: "#FF2D5E",
          dim: "#C41F49",
          soft: "#3A1420",
        },
        volt: {
          DEFAULT: "#A855F7",
          soft: "#241332",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-space-grotesk)", "sans-serif"],
      },
      backgroundImage: {
        "grain": "url('/grain.svg')",
        "hero-fade":
          "linear-gradient(180deg, rgba(11,11,14,0.15) 0%, rgba(11,11,14,0.55) 55%, rgba(11,11,14,0.96) 100%)",
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      borderRadius: {
        card: "6px",
      },
    },
  },
  plugins: [],
};
export default config;
