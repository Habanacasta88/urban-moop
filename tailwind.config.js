/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#01F9C6',   // Teal / Turquesa Vivo
                secondary: '#FFA500', // Naranja Vibrante
                contrast: '#0047AB',  // Azul Oscuro / Cobalto
                black: '#000000',     // Negro Puro
            },
            fontFamily: {
                sans: ['Poppins', 'Montserrat', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
