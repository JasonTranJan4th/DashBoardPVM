/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'primary-color': '#0a2e5ed0',
        'secondary-color': '#e3e3e3',
        'text-white': '#ffffff',
        'success': '#00ff1b',
        'danger': '#d60d0d',
        'normal': '#ebf10a'
      }
    },
  },
  plugins: [],
}

