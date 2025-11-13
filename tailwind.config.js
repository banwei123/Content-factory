/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "'PingFang SC'", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50: "#f5f5ff",
          100: "#ebeafd",
          200: "#dcdcf9",
          300: "#c3c2f2",
          400: "#a4a0ea",
          500: "#7f76de",
          600: "#5b5bd6",
          700: "#4a3fb0",
          800: "#3b2f88",
          900: "#2b2162",
        },
      },
      boxShadow: {
        card: "0 12px 24px -16px rgba(15, 23, 42, 0.4)",
        glow: "0 15px 35px rgba(91, 91, 214, 0.25)",
      },
    },
  },
  plugins: [],
}
