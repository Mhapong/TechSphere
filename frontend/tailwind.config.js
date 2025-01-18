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
        red: {
          100: "#ffd9e5",
          200: "#ffb3cb",
          300: "#ff8cb1",
          400: "#ff6697",
          500: "#ff407d",
          600: "#cc3364",
          700: "#99264b",
          800: "#661a32",
          900: "#330d19"
        },
        pink: {
          100: "#fff4f6",
          200: "#ffeaee",
          300: "#ffdfe5",
          400: "#ffd5dd",
          500: "#ffcad4",
          600: "#cca2aa",
          700: "#99797f",
          800: "#665155",
          900: "#33282a"
        },
      },
    },
  },
  plugins: [],
});