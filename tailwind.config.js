/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Warm pastel palette
        primary: {
          50: '#fef7f3',
          100: '#fdeee6',
          200: '#fad4c0',
          300: '#f7ba9a',
          400: '#f49f73',
          500: '#f1854d',
          600: '#e56a28',
          700: '#b84f1a',
          800: '#8a3b13',
          900: '#5c280d',
        },
        secondary: {
          50: '#faf7f5',
          100: '#f5efeb',
          200: '#e8d7cd',
          300: '#dbbfaf',
          400: '#cea791',
          500: '#c18f73',
          600: '#a67155',
          700: '#7e5540',
          800: '#5f3f30',
          900: '#3f2a20',
        },
        accent: {
          50: '#fef8f4',
          100: '#fdf1e9',
          200: '#f9dcc8',
          300: '#f5c7a7',
          400: '#f1b286',
          500: '#ed9d65',
          600: '#e98844',
          700: '#c46b2b',
          800: '#935020',
          900: '#623515',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}