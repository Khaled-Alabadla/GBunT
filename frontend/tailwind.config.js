/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1b120b',
        'chat-card': '#2c1e14',
        text: '#e6ccb2',
        accent: '#9c6644',
        'accent-hover': '#b07a54',
        'accent-light': '#c4a484',
        cream: '#f5efe6',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'tajawal': ['"Tajawal"', 'sans-serif'],
        'lato': ['"Lato"', 'sans-serif'],
        'cairo': ['"Cairo"', 'sans-serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
        'poppins': ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
