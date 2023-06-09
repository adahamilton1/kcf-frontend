/* eslint-disable import/no-extraneous-dependencies */
// silence `'vite' should be listed in project's dependencies, not devDependencies`

/** @type {import("tailwindcss").Config} */
module.exports = {
  // dont use overly-broad patterns like ./**/*.{js,css,html}
  // since this has no exclude option
  content: ["./index.html", "./404.html", "./css/**/*.css", "./js/**/*.js"],
  darkMode: "class",
  theme: {
    // Note: these overwrites defaults e.g. bg-black is no longer useable
    textColor: {
      light: {
        primary: "#000000",
        faded: "#606060",
      },
      dark: {
        primary: "#ffffff",
        faded: "#9f9f9f",
      },
      success: "#439643",
      failure: "#964343",
      warning: "#ff6700",
    },
    backgroundColor: {
      light: {
        main: "#ffffff",
        hover: "#f0f0f0",
      },
      dark: {
        main: "#0f172a",
        hover: "#1e2639",
      },
      black: "#000000",
      transparent: "transparent",
      button: {
        /* hot pink */
        primary: "#ec058e",
        /* green, slightly darker than true complement */
        complementary: "#00da51",
      },
    },
    borderColor: {
      light: {
        primary: "#000000",
      },
      dark: {
        primary: "#6f6f6f",
      },
      failure: "#964343",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
};
