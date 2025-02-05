const withMT = require("@material-tailwind/react/utils/withMT");
const colors = require('tailwindcss/colors')

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}"

  ],
  theme: {
    extend: {
      colors: {
        teal: {
          100: "#d3eaeb",
          200: "#a7d5d6",
          300: "#7ac1c2",
          400: "#4eacad",
          500: "#229799",
          600: "#1b797a",
          700: "#145b5c",
          800: "#0e3c3d",
          900: "#071e1f"
        },
        indigo: {
          100: "#d9e1ec",
          200: "#b3c2d8",
          300: "#8ca4c5",
          400: "#6685b1",
          500: "#40679e",
          600: "#33527e",
          700: "#263e5f",
          800: "#1a293f",
          900: "#0d1520"
        },
      },
      rubberband: {
        "0%": {
          transform: "scaleX(0.9) scaleY(1)",
        },
        "40%": {
          transform: "scaleX(1.30) scaleY(0.65)",
        },
        "55%": {
          transform: "scaleX(0.85) scaleY(1)",
        },
        "65%": {
          transform: "scaleX(1.09) scaleY(0.55)",
        },
        "75%": {
          transform: "scaleX(0.80)  scaleY(0.85)",
        },
        "85%": {
          transform: "scaleX(1.01)  scaleY(0.40)",
        },
        "90%": {
          transform: "scaleX(0.75)  scaleY(0.80)",
        },
        "95%": {
          transform: "scaleX(1.05)  scaleY(0.95)",
        },
        "100%": {
          transform: "scaleX(1) scaleY(1)",
        },
      }
    },
    animation: {
      "rubber-band": "rubberband 1s linear 1 ",
    },
  },
  plugins: [],
});