/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: [
    './views/**/*.ejs',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      green: {
        light: '#9FD661',
        DEFAULT: '#8BC34A',
        dark: '#719F3C'
      },
      gray: {
        darkest: '#37474F',
        dark: '#597380',
        DEFAULT: '#99B3BF',
        lighter: '#D0DBE2',
        light: '#ECEFF1',
        lightest: '#F2F5F7'
      },
      white: '#fff',
      red: colors.red,
      yellow: colors.amber,
    },
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  },
  plugins: [],
};
