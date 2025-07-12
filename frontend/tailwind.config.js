/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // For Next.js pages
    './components/**/*.{js,ts,jsx,tsx}', // If you're using components
    './app/**/*.{js,ts,jsx,tsx}', // If using /app directory (Next.js 13+)
  ],
  theme: {
    extend: {
      colors: {
        orangeCustom: '#FC4F00',
      },
    },
  },
  plugins: [],
};
