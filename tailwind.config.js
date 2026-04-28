/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        cream:   '#FDF8F0',
        'dark-green': '#0D2818',
        accent: {
          yellow: '#F5C842',
          orange: '#F97316',
        },
        brand: {
          green:  '#16a34a',
          red:    '#dc2626',
          orange: '#f97316',
          blue:   '#2563eb',
        },
      },
      fontFamily: {
        sans:   ['var(--font-inter)', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card':       '0 2px 24px rgba(0,0,0,0.07)',
        'card-hover': '0 12px 48px rgba(0,0,0,0.13)',
        'green':      '0 4px 24px rgba(34, 197, 94, 0.35)',
        'green-lg':   '0 8px 40px rgba(34, 197, 94, 0.4)',
      },
      animation: {
        'fade-in':     'fadeIn 0.6s ease-out forwards',
        'fade-in-up':  'fadeInUp 0.7s ease-out forwards',
        'slide-right': 'slideRight 0.7s ease-out forwards',
        'float':       'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'blob':        'blob 8s ease-in-out infinite',
        'blob-delay':  'blob 8s ease-in-out 3s infinite',
        'blob-delay2': 'blob 8s ease-in-out 6s infinite',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'scale-in':    'scaleIn 0.5s ease-out forwards',
        'spin-slow':   'spin 12s linear infinite',
        'shimmer':     'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
        blob: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(40px, -60px) scale(1.15)' },
          '66%':  { transform: 'translate(-30px, 30px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
