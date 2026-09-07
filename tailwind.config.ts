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
        ink: { DEFAULT: "#24170e", soft: "#4b3422" },
        parchment: {
          DEFAULT: "#d9bd82",
          light: "#f0dfb0",
          dark: "#927049",
        },
        paper: { DEFAULT: "#ead39b", shadow: "#6b4728" },
        brown: { DEFAULT: "#4b2e18", dark: "#24150b" },
        wood: "#28160c",
        gold: {
          DEFAULT: "#d8aa50",
          light: "#ffe3a0",
          dark: "#8c5d1c",
        },
        sea: { DEFAULT: "#102e34", light: "#1d5054" },
        magic: {
          DEFAULT: "#63e7ff",
          blue: "#39a9ff",
          purple: "#9c72ff",
        },
        danger: "#d7654d",
        border: "#593617",
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        fell: ['"IM Fell English"', "Georgia", "serif"],
        uncial: ['"Uncial Antiqua"', "serif"],
      },
      animation: {
        "dust-float": "dustFloat 28s linear infinite",
        "compass-float": "compassFloat 4s ease-in-out infinite",
        "ship-sail": "shipSail 2.8s ease-in-out infinite",
        "wake-pulse": "wakePulse 1.5s ease-in-out infinite",
        "magic-twinkle": "magicTwinkle 1.7s ease-in-out infinite",
        "scan": "hologramScan 5s linear infinite",
        "media-scan": "mediaScan 5s linear infinite",
        "rune-border": "runeBorder 9s linear infinite",
      },
      keyframes: {
        dustFloat: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-100px, -140px, 0)" },
        },
        compassFloat: {
          "0%,100%": { transform: "rotate(-2deg) translateY(0)" },
          "50%": { transform: "rotate(2deg) translateY(-3px)" },
        },
        shipSail: {
          "0%,100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        wakePulse: {
          "0%,100%": { opacity: ".35", transform: "scaleX(.7)" },
          "50%": { opacity: ".9", transform: "scaleX(1.1)" },
        },
        magicTwinkle: {
          "0%,100%": { opacity: ".35", transform: "scale(.8) rotate(0)" },
          "50%": { opacity: "1", transform: "scale(1.25) rotate(20deg)" },
        },
        hologramScan: {
          from: { transform: "translateY(-30%)" },
          to: { transform: "translateY(30%)" },
        },
        mediaScan: {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(390%)" },
        },
        runeBorder: {
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
