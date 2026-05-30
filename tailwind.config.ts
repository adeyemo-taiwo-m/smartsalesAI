import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        brand: {
          green:         '#1D6B4A',   // Primary CTA, active nav, buttons, focus rings
          purple:        '#7C3AED',   // AI indicators, secondary accent
          'green-light': '#22C55E',   // Success states, WhatsApp, positive trends
          orange:        '#F97316',   // Warning states, revenue highlight, warm leads
        },
        dark: {
          DEFAULT: '#0F172A',   // Page background
          card:    '#1E293B',   // Cards, sidebar, panels
          border:  '#334155',   // Borders, dividers
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card':          '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(51,65,85,0.5)',
        'card-hover':    '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(29,107,74,0.15)',
        'green':         '0 0 20px rgba(29,107,74,0.25)',
        'green-soft':    '0 0 20px rgba(34,197,94,0.15)',
        'purple':        '0 0 20px rgba(124,58,237,0.2)',
        'widget':        '0 25px 60px rgba(0,0,0,0.7)',
        'pricing-glow':  '0 8px 40px rgba(29,107,74,0.3)',
      },
      backgroundImage: {
        'hero-glow':      'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(29,107,74,0.25) 0%, transparent 70%)',
        'brand-gradient': 'linear-gradient(to right, #1D6B4A, #7C3AED)',
      },
      animation: {
        'float':    'float 4s ease-in-out infinite',
        'slide-up': 'slide-up 0.25s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
