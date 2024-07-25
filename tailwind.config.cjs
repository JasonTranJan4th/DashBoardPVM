/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'primary-color': '#012060',
        'black-color': '#1F1F1F',
        'secondary-color': '#e3e3e3',
        'text-white': '#ffffff',
        'success': '#02b365',
        'danger': '#fb0003',
        'normal': '#ebf10a',
        'dark-grey': '#444444',
        'blue-gray-900': '#536872',
      },
      screens: {
        'xs': '390px',
      },
      spacing: {
        '29': '7.5rem'
      }
    },
  },
  plugins: [],
}

