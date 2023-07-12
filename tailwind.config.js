/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1DB954',
        'spotify-black': '#191414'
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif']
      }
    },
  },
  plugins: [],
};

