/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'blue': '#143CD8',
      'yellow': '#FDC904',
      'darkblue': '#000D40',
      'white': '#FFFFFF',
      'green': '#05B85D',
      'red': '#FD0300',
      'lightblue': '#D3E2EC',
      'black': '#201E23',
      'transparent': 'transparent',
    },
    fontFamily: {
      teko: ["Teko", "sans-serif"],
      manrope: ["Manrope", "sans-serif"],
    },
    backgroundImage: {
      bgmain: "url('/src/img/backgrounds/mainbg.jpg')",
    }
  },
  plugins: [],
}