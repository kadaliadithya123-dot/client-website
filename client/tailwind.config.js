/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050b18",
          900: "#0a1428",
          800: "#0f1e3d",
          700: "#152a52",
        },
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          200: "#b7d9ff",
          300: "#84beff",
          400: "#4a9aff",
          500: "#1f77f5",
          600: "#0f5cd1",
          700: "#0d49a8",
          800: "#0f3d87",
          900: "#11346f",
        },
        mist: "#f4f6fa",
        steel: "#8b96a8",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "circuit": "radial-gradient(circle at 1px 1px, rgba(31,119,245,0.15) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
