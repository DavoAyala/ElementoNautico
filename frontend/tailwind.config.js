/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0369a1',
        secondary: '#0ea5e9',
        accent: '#f59e0b',
      },
    },
  },
  plugins: [],
}
