/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-blue": "#002B5B",
        "gray-blue": "#2B4865",
        "green-blue": "#256D85",
        "brand-color": "#167ec1",
        "light-green": "#8FE3CF",
      },
      spacing: {
        "below-parent": "calc(100% + 5px)",
      },
    },
  },
  plugins: [],
};
