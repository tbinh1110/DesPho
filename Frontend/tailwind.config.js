/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            zIndex: {
                '50': '50',
                '60': '60',
                '100': '100',
            },
            spacing: {
                '16.25': '4.0625rem',
                '17.5': '4.375rem',
                '22': '5.5rem',
                '25': '6.25rem',
                '32.5': '8.125rem',

            },
            blur: {
                '80': '80px',
                '120': '120px',
            },
            maxWidth: {
                '25': '6.25rem',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}