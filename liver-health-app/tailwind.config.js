/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF5FF', // Generated light tint
          100: '#F3E8FF', // Generated light tint
          200: '#E9D5FF', // Generated
          300: '#514FF5', // User defined: Gradient End
          400: '#5840F5', // User defined: Link/Focus
          500: '#6D36F7', // User defined: Gradient Mid
          600: '#9326F8', // User defined: Gradient Start
          700: '#A010F8', // User defined: Headline/Accent
          800: '#6B21A8', // Darker fallback
          900: '#581C87', // Darker fallback
        },
        // We overwrite slate with the User's "Neutrals" where possible or just provide semantic aliases
        surface: {
          DEFAULT: '#F8F8F8',
          2: '#F0F0F0'
        },
        border: '#E6E6E6',
        text: {
          primary: '#1A1315',
          secondary: '#3A3A3A',
          muted: '#6B7280'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
