/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        mp: {
          blue: '#009EE3',
          'blue-dark': '#007EBA',
          'blue-light': '#E5F4FF',
          green: '#00A650',
          'gray-bg': '#F5F5F5',
        },
      },
    },
  },
  plugins: [],
}

