// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'smh': { 'raw': '(min-height: 480px)' }, // small height
        'mdh': { 'raw': '(min-height: 768px)' }, // medium height
        'lgh': { 'raw': '(min-height: 1010px)' }, // large height
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          /* Hide scrollbar for Chrome, Safari and Opera */
          '::-webkit-scrollbar': {
            display: 'none',
          },
          /* Hide scrollbar for IE, Edge and Firefox */
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      });
    },
  ],
}
