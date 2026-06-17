/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00B9FC',
          hover: '#009ED6',
          light: '#E6F7FF',
          50: '#F0FAFF',
        },
        surface: {
          DEFAULT: '#F8FAFB',
          hover: '#F0F4F7',
        },
        border: {
          DEFAULT: '#E2E8F0',
          strong: '#CBD5E1',
        },
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#94A3B8',
        accept: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        reject: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        epsilon: '#8B5CF6',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Segoe UI"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
