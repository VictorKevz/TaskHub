/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-gray": "#191B1F",
        "charcoal": "#2A2D32",
        "cream": "#FEF7EE",
        "slate": "#7E878D",
        "gunmetal": "#3A3E44",
        "crimson": "#AA2E26",
        "pale-pink": "#F9E3E2",
        "azure": "#3662E3",
        "light-blue": "#DEE9FC",
        "goldenrod": "#C18D30",
        "light-cream": "#FDF9C9",
        "emerald": "#4CA154",
        "mint": "#E2FBE8",
        "soft-cream": "#FEF7EE",
        "lavender": "#F0F6FE"
      }
    }
  },
  plugins: [],
}

