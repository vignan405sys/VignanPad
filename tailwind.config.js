/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                glass: "rgba(255, 255, 255, 0.1)",
                glassBorder: "rgba(255, 255, 255, 0.12)",
                surface: {
                    base: '#0c1222',
                    elevated: '#131b2e',
                },
            },
            borderRadius: {
                'panel': '1rem',
                'panel-lg': '1.25rem',
            },
            boxShadow: {
                'panel': '0 4px 24px -4px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.04)',
                'glow': '0 0 32px -8px rgba(99, 102, 241, 0.25)',
                'glow-sm': '0 0 16px -4px rgba(99, 102, 241, 0.2)',
            },
            transitionDuration: {
                'fast': '150ms',
                'smooth': '250ms',
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [],
}
