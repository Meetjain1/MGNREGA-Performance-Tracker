/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e2',
          100: '#fce7c6',
          200: '#f9cf8d',
          300: '#f6b654',
          400: '#f39d1b',
          500: '#f08700',
          600: '#d16a00',
          700: '#b24d00',
          800: '#933000',
          900: '#741300',
        },
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1' }],
        '3xl-readable': ['2rem', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [],
}
