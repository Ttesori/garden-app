/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/**/*.ejs',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      green: {
        light: '#95D14F',
        DEFAULT: '#8BC34A',
        dark: '#719F3C'
      },
      gray: {
        darkest: '#37474F',
        dark: '#597380',
        DEFAULT: '#99B3BF',
        light: '#ECEFF1',
        lightest: '#F2F5F7'
      },
      white: '#fff'
    },
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  },
  plugins: [],
};
