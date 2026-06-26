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
        ink: "#111827",
        line: "#d8dee8"
      },
      boxShadow: {
        panel: "0 14px 40px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
