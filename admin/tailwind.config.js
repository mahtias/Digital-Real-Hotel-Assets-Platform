/** @type {import('tailwindcss').Config} */
// Palette mirrors CoreUI v5 design tokens (https://coreui.io)
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: "#5856d6", hover: "#4b49b6", subtle: "#deddf7", emphasis: "#232256" },
        secondary: { DEFAULT: "#6b7785", hover: "#5b6571", subtle: "#e1e4e7", emphasis: "#2b3035" },
        success:   { DEFAULT: "#1b9e3e", hover: "#178635", subtle: "#d1ecd8", emphasis: "#0b3f19" },
        info:      { DEFAULT: "#3399ff", hover: "#2b82d9", subtle: "#d6ebff", emphasis: "#143d66" },
        warning:   { DEFAULT: "#f9b115", hover: "#d4960f", subtle: "#feefd0", emphasis: "#644708" },
        danger:    { DEFAULT: "#e55353", hover: "#c34747", subtle: "#fadddd", emphasis: "#5c2121" },
        dark:      { DEFAULT: "#212631", hover: "#1c2029" },
        light:     { DEFAULT: "#f3f4f7" },
        body:      { DEFAULT: "#252b36", muted: "#6d7381" },
        line:      { DEFAULT: "#dbdfe6", input: "#b1b7c1" },
        // kept for backward compatibility
        brand: { 50: "#deddf7", 500: "#5856d6", 600: "#5856d6", 700: "#4b49b6", 900: "#232256" },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', '"Noto Sans"', '"Liberation Sans"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: "0 1px 1px 0 rgba(8,10,12,.04), 0 2px 1px -1px rgba(8,10,12,.03), 0 1px 3px 0 rgba(8,10,12,.08)",
      },
    },
  },
  plugins: [],
};
