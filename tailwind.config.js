/** @type {import('tailwindcss').Config} */
const withOpacity = (variableName) => {
    return ({ opacityValue }) => {
        if (opacityValue)
            return `rgba(var(--${variableName}), ${opacityValue})`;
        return `rgba(var(--${variableName}))`;
    };
};
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            screens: {
                '0xs': '1px',
                xxs: '319px',
                '2xxs': '360px',
                xs: '450px',
                '2xs': '555px',
                '2md': '888px',
                '2lg': '1124px',
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
            },
            backgroundColor: {
                skin: {
                    default: 'var(--color-bg-default)',
                },
            },
            colors: {
                'slate-350': '#b2bccc',
            },
        },
    },
    plugins: [require('tailwind-scrollbar-hide')],
};
