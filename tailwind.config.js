/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E26D8A',
          dark: '#C85A75',
          light: '#FCE7EF',
        },
      },
    },
  },
  plugins: [],
};
