/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sumi: {
          950: '#0b0d10', // Deep matte charcoal canvas
          900: '#111419', // Primary bento surface
          850: '#161b22', // Elevated interactive surface
          800: '#222933', // Crisp 1px technical border
          700: '#323d4d',
          600: '#47566c',
          400: '#8c9cb0',
          200: '#cbd5e1',
          100: '#f1f5f9',
        },
        tokyo: {
          blue: '#2563eb',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          cyan: '#06b6d4',
        }
      },
      fontFamily: {
        sans: ['"Zen Kaku Gothic New"', '"Noto Sans JP"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'Menlo', 'monospace'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      }
    },
  },
  plugins: [],
}
