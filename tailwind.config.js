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
        forestGreen: '#1E3A2F',
        forestLight: '#2C5544',
        forestDark: '#142921',
        warmIvory: '#FBF8F2',
        deepBrown: '#1A2420',
        deepForest: '#1A2420',
        saffron: '#D4A359',
        antiqueGold: '#D4A359',
        goldAccent: '#C8933E',
        mutedOlive: '#69756F',
        sageMuted: '#69756F',
        softWhite: '#FFFFFF',
        cardBorder: '#EAE5DA',
        // Dark mode specific tokens
        darkBg: '#0F1A14',
        darkSurface: '#182920',
        darkCard: '#1E3328',
        darkBorder: '#2A4436',
        darkText: '#F1F5F2',
        darkMuted: '#9BA8A1',
      },
      fontFamily: {
        devanagari: ['"Noto Serif Devanagari"', 'Rozha One', 'Yatra One', 'serif'],
        heading: ['Cinzel', 'Playfair Display', 'Cormorant Garamond', 'serif'],
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(26, 36, 32, 0.04)',
        card: '0 4px 20px -2px rgba(26, 36, 32, 0.06)',
        gold: '0 4px 20px rgba(212, 163, 89, 0.2)',
        forest: '0 4px 20px rgba(30, 58, 47, 0.25)',
      }
    },
  },
  plugins: [],
}
