/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dce8ff',
          200: '#bdd2ff',
          300: '#8eb1ff',
          400: '#5786ff',
          500: '#2f60f6',
          600: '#1a45e5',
          700: '#1635c5',
          800: '#172e9d',
          900: '#192c7c',
          950: '#101a4a',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      boxShadow: {
        soft: '0 1px 2px rgb(15 23 42 / 0.04), 0 4px 16px rgb(15 23 42 / 0.06)',
        glow: '0 0 0 1px rgb(47 96 246 / 0.15), 0 8px 24px rgb(47 96 246 / 0.18)',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #1a45e5 0%, #2f60f6 45%, #5786ff 100%)',
        'mesh':
          'radial-gradient(at 20% 10%, rgba(47,96,246,0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(87,134,255,0.12) 0px, transparent 50%), radial-gradient(at 0% 80%, rgba(26,69,229,0.10) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 240ms ease-out',
        'slide-up': 'slideUp 280ms cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-in-right': 'slideInRight 320ms cubic-bezier(0.22, 1, 0.36, 1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};
