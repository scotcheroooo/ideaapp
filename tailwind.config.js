/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0F1014",
          900: "#14151A",
          800: "#1B1D24",
          700: "#23252E",
          600: "#2D2F3A",
          500: "#3C3F4E",
        },
        paper: {
          100: "#F4F2EC",
          200: "#ECEAE2",
          300: "#D8D5C9",
          400: "#9C9A90",
        },
        amber: {
          400: "#F0B556",
          500: "#E8A33D",
          600: "#C8862A",
        },
        teal: {
          400: "#6FC2BA",
          500: "#4FA8A0",
          600: "#3A847D",
        },
        rust: {
          400: "#D9714E",
          500: "#C25B3A",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 20px -8px rgba(0,0,0,0.5)",
        lifted: "0 1px 0 rgba(255,255,255,0.06) inset, 0 16px 32px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
