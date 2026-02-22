/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sans-Regular"],
        sansBold: ["Sans-Bold"],
        sansBlack: ["Sans-Black"],
        sansSemiBold: ["Sans-SemiBold"],
        sansMedium: ["Sans-Medium"],
        sansItalic: ["Sans-Italic"],
      },
      colors:{
        primary:'#337535',
        dark:'#221D23'
      }
    },
  },
  plugins: [],
};
