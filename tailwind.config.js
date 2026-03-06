/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#0A0E1A',
                    secondary: '#0F1629',
                },
                accent: {
                    cyan: '#00D4FF',
                    violet: '#7C3AED',
                },
                success: '#10B981',
                warning: '#F59E0B',
                danger: '#EF4444',
                border: '#1E2D4A',
                muted: '#94A3B8',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                glow: '0 0 20px rgba(0, 212, 255, 0.15)',
                'glow-violet': '0 0 20px rgba(124, 58, 237, 0.2)',
                'glow-success': '0 0 20px rgba(16, 185, 129, 0.2)',
                'glow-danger': '0 0 20px rgba(239, 68, 68, 0.2)',
            },
            backdropBlur: {
                glass: '12px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-in': 'slideIn 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-12px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        },
    },
    plugins: [],
}
