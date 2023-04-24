/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cOrange: '#F2A549',
        dOrange: '#F27C38',
        cBlack: '#0D0D0D',
        cBrown: '#8C5627',
        white: '#ffffff',

      },
      fontFamily: {
        sans: ['var(--font-metropolis)', ...fontFamily.sans],
        thunder: ['var(--font-thunder)'],
      }
    },
  },
  plugins: [],
};
