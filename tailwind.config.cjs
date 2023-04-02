/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: [
        'Söhne',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Ubuntu',
        'Cantarell',
        'Noto Sans',
        'sans-serif',
        'Helvetica Neue',
        'Arial',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
      ],
      mono: ['Söhne Mono', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'monospace'],
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            pre: { padding: 0, margin: 0 },
            ul: {
              'list-style-type': 'none',
            },
          },
        },
      },
      colors: {
        gray: {
          50: 'var(--color-50)',
          100: 'var(--color-100)',
          200: 'var(--color-200)',
          300: 'var(--color-300)',
          400: 'var(--color-400)',
          500: 'var(--color-500)',
          600: 'var(--color-600)',
          700: 'var(--color-700)',
          800: 'var(--color-800)',
          900: 'var(--color-900)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
