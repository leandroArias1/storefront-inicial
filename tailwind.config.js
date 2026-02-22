/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        rossa: {
          blue: '#1B4FD8',
          red: '#E02020',
          light: '#F5F5F5',
          gray: '#E8E8E6',
          steel: '#D0D0CE',
          dark: '#111111',
          white: '#FFFFFF',
        },
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scroll: 'scroll 25s linear infinite',
      },
    },
  },
  plugins: [],
}
