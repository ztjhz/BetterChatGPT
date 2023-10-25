/** @type {import('tailwindcss').Config} */

function parentSiblingHoverPlugin({ addVariant, e }) {
  addVariant('parent-sibling-hover', ({ modifySelectors, separator }) => {
    modifySelectors(({ className }) => {
      return `.parent-sibling:hover ~ .parent .${e(
        `parent-sibling-hover${separator}${className}`
      )}`;
    });
  });
}

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: [
        'Söhne',
        'Roboto',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
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
      mono: [
        'Söhne Mono',
        'Monaco',
        'Andale Mono',
        'Ubuntu Mono',
        'Consolas',
        'monospace',
      ],
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
          50: '#f7f7f8',
          100: '#ececf1',
          200: '#d9d9e3',
          300: '#d1d5db',
          400: '#acacbe',
          500: '#8e8ea0',
          600: '#4b5563',
          650: '#444654',
          700: '#40414f',
          800: '#343541',
          850: '#2A2B32',
          900: '#202123',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), parentSiblingHoverPlugin],
  darkMode: 'class',
};
