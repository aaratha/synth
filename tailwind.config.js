/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgba(0,18,16,0.6)',
        board: 'rgb(255,255,255,0.05)',
        text1: 'rgba(204,221,218,0.8)',
        moduleGreen: 'rgb(0,48,25, 0.6)',
        moduleBlue: 'rgb(0,71,102,0.3)'
      }
    }
  },
  plugins: []
}