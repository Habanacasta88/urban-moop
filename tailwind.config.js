/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // New Brand Palette
                brand: {
                    700: 'var(--brand-700)',
                    600: 'var(--brand-600)',
                    500: 'var(--brand-500)',
                    400: 'var(--brand-400)',
                    300: 'var(--brand-300)',
                },
                // Neutrals
                bg: 'var(--bg)',
                surface: 'var(--surface)',
                'surface-2': 'var(--surface-2)',
                border: 'var(--border)',
                text: 'var(--text)',
                'text-2': 'var(--text-2)',
                muted: 'var(--muted)',

                // Mappings for backwards compatibility
                primary: 'var(--brand-600)',
                secondary: 'var(--brand-300)',
                contrast: '#A010F8', // Mapped to Brand 700
                black: 'var(--text)',
            },
            fontFamily: {
                sans: ['Poppins', 'Montserrat', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
