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
        panel: "0 24px 80px rgba(2, 6, 4, 0.58), 0 1px 0 rgba(153, 246, 228, 0.08) inset",
        glow: "0 0 34px rgba(45, 212, 191, 0.26), 0 18px 48px rgba(2, 6, 4, 0.38)",
        "soft-panel": "0 18px 46px rgba(2, 6, 4, 0.44), 0 1px 0 rgba(255, 255, 255, 0.04) inset"
      }
    }
  },
  plugins: []
};
