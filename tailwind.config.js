/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['Press Start 2P', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out-up': 'fadeOutUp 2s ease-out forwards',
        'bounce-in': 'bounceIn 0.4s ease-out',
        'pulse-glow': 'pulseGlow 1.5s ease-in-out infinite',
        'level-up': 'levelUp 3s ease-out',
        'particle': 'particle 2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOutUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-50px)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        levelUp: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '20%': { transform: 'scale(1.2)', opacity: '1' },
          '40%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        particle: {
          '0%': { 
            transform: 'translate(0, 0) scale(1)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'translate(calc(var(--x) * 100px), calc(var(--y) * 100px)) scale(0)', 
            opacity: '0' 
          },
        },
      },
    },
  },
  plugins: [],
}