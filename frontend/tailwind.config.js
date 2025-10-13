/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Anton', 'sans-serif'],
        body: ['EB Garamond', 'serif'],
      },
      colors: {
        hustleRed: '#8b0000',
        hustleGold: '#ffd700',
        hustleNavy: '#001a33',
      },
    },
  },
  plugins: [],
}