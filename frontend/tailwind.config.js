/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./dist/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF2D55',
          dark: '#E6003D',
          light: '#FF5678'
        },
        dark: {
          DEFAULT: '#0F0F23',
          light: '#1A1A2E',
          lighter: '#252538'
        }
      },
      fontFamily: {
        'display': ['Integral CF', 'sans-serif'],
        'sans': ['Satoshi', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
