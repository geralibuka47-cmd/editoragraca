/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Cormorant Garamond', 'serif'],
            },
            colors: {
                brand: {
                    50: '#F9F9F9',   // Cinza ultra leve
                    100: '#F2F2F2',  // Cinza elegante (bordas)
                    200: '#E5E5E5',  // Cinza médio para divisores
                    800: '#1A1A1A',  // Preto suave
                    900: '#000000',  // Preto absoluto
                },
                accent: {
                    gold: '#C5A059',      // Dourado Sofisticado
                    goldLight: '#D4AF37', // Dourado Vibrante
                    goldDark: '#A68039',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-out forwards',
                'slide-up': 'slideUp 0.6s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
