/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#f5f5f4",
        line: "rgba(153, 246, 228, 0.22)"
      },
      boxShadow: {
        panel: "0 24px 80px rgba(12, 10, 9, 0.44)",
        glow: "0 0 34px rgba(45, 212, 191, 0.2)"
      }
    }
  },
  plugins: []
};
