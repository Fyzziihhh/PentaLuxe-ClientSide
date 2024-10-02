/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBlue: "#0E101C",
        secondary: "#161929",
      },
      width: {
        "logo-small": "150px",
        "logo-medium": "250px",
        "logo-large": "400px",
      },
      height: {
        "logo-small": "75px",
        "logo-medium": "125px",
        "logo-large": "200px",
      },
      fontFamily: {
        almendra: ["Almendra", "serif"],
        Bowly: ["Bowlby One SC", "serif"],
        gilroy: ["Gilroy", "sans-serif"],
        averta: ["Averta CY", "sans-serif"],
        Quando: ["Quando", "sans-serif"],
        Lilita: ["Lilita One", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
