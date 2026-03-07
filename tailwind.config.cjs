/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6366f1",
          dark: "#4f46e5",
          light: "#e0e7ff"
        }
      }
    }
  },
  plugins: []
};
