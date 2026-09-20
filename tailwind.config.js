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
          950: 'rgb(var(--color-sumi-950) / <alpha-value>)',
          900: 'rgb(var(--color-sumi-900) / <alpha-value>)',
          850: 'rgb(var(--color-sumi-850) / <alpha-value>)',
          800: 'rgb(var(--color-sumi-800) / <alpha-value>)',
          700: 'rgb(var(--color-sumi-700) / <alpha-value>)',
          600: 'rgb(var(--color-sumi-600) / <alpha-value>)',
          400: 'rgb(var(--color-sumi-400) / <alpha-value>)',
          200: 'rgb(var(--color-sumi-200) / <alpha-value>)',
          100: 'rgb(var(--color-sumi-100) / <alpha-value>)',
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
        sans: ['"Inter"', '"Zen Kaku Gothic New"', '"Noto Sans JP"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
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
