/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        nexa: {
          blue: '#00c2ff',
          green: '#00df82',
          dark: '#0a0a1a'
        },
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#00df82',
          600: '#05c473',
          700: '#04a15f',
          800: '#067d4c',
          900: '#07663f',
        }
      }
    },
  },
  plugins: [],
}