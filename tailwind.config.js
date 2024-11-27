/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#387F39',
        secondary: '#D6EFD8',
        darkGray: '#37474F',
        lightWhite: '#F5F5F5',
        accentYellow: '#FFEB3B',
        accentBlue: '#03A9F4',
      },
    },
  },
  plugins: [],
}

