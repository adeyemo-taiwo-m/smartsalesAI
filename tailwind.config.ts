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
          blue:   '#2563EB',
          purple: '#7C3AED',
          green:  '#22C55E',
          orange: '#F97316',
        },
        dark: {
          DEFAULT: '#0F172A',
          card:    '#1E293B',
          border:  '#334155',
        }
      },
      boxShadow: {
        'card':        '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(51,65,85,0.5)',
        'card-hover':  '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(37,99,235,0.15)',
        'blue':        '0 0 20px rgba(37,99,235,0.2)',
        'purple':      '0 0 20px rgba(124,58,237,0.2)',
        'green':       '0 0 20px rgba(34,197,94,0.15)',
        'widget':      '0 25px 60px rgba(0,0,0,0.7)',
        'pricing-glow':'0 8px 40px rgba(37,99,235,0.25)',
      }
    },
  },
  plugins: [],
};
export default config;
