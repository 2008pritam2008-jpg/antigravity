/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          700: '#15803d',
          800: '#166534',
          900: '#1b4332',
          950: '#0f241c',
        },
        agri: {
          green: '#2d6a4f',
          leaf: '#52b788',
          mint: '#74c69d',
          sand: '#fefae0',
          yellow: '#e9c46a',
          earth: '#dda15e',
          brown: '#bc6c25',
          bg: '#f8faf9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
