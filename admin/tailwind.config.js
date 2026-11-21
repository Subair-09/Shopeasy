/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        shopeasy: {
          primary: '#5135ED',
          secondary: '#3925C5',
          dark: '#281B9B',
          light: '#EEEAFE',
          accent: '#FFC928',
          bg: '#F7F7FC',
          card: '#FFFFFF',
          text: '#15152D',
          muted: '#77778D',
          border: '#E8E7F0',
          success: '#19A76B',
          warning: '#FFBE45',
          error: '#E94B59',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(81, 53, 237, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        card: '0 10px 30px -5px rgba(21, 21, 45, 0.05)',
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
