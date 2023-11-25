/*@type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        meety: {
          btn_light_blue: "#779CF9",
          btn_middle_blue: "#4777F1",
          btn_dark_blue: "#1550E8",
          main_background: "#FAFAFA",
          del_red: "#E43434",
          cal_blue: "#4777F1",
          cal_background: "#E6E6E6",
          drag_green: "#5CE806",
          drag_background: "#FAFAFA",
          menu_sat_blue: "#1B51DC",
          text_dark_gray: "#4D4D4D",
          vote_option_background: "#EDEDED",
          vote_option_text_gray: "#808080",
          drag_bar_outline_gray: "#E9E9E9",
          component_outline_gray: "#CFCFCF",
          exp_text_gray: "#A2A2A2",
          snackbar_background: "#202123"
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
