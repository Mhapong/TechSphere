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
        white: {
          100: "#fdfdfd",
          200: "#fbfbfb",
          300: "#f9f9f9",
          400: "#f7f7f7",
          500: "#f5f5f5",
          600: "#c4c4c4",
          700: "#939393",
          800: "#626262",
          900: "#313131"
        },
        blue: {
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
      },
    },
  },
  plugins: [],
});