/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040d21',
          900: '#071739',
          800: '#0e2454',
          700: '#163575',
          600: '#214e9f',
        },
        brand: {
          cyan: '#00d2ff',
          hoverCyan: '#00b8e6',
          dark: '#071739',
          card: '#0c2048'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
