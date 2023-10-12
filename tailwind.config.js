/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/screens/**/*.tsx",
    "./src/components/**/*.tsx"
  ],
  theme: {
    extend: {
      colors: {
        'gray': {
          700: '#121214',
          600: '#202024',
          500: '#29292E',
          400: '#323238',
          300: '#7C7C8A',
          200: '#C4C4CC',
          100: '#E1E1E6',
        } ,
        'blue': {
          300: '#85ACF8',
          400: '#6591F1',
          500: '#3568E9',
          600: '#264FC8',
          700: '#1A3AA7',
        },
        'green' : {
          700: '#00875F',
          500: '#00B37E',
        },
        'red': {
          500: '#F75A68',
        },
      }
    },
  },
  plugins: [],
}

