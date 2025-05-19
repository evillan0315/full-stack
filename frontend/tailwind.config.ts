import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Include .mdx files for potential use
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              'color': theme('colors.indigo.600'),
              '&:hover': {
                color: theme('colors.indigo.700'),
              },
            },

            blockquote: {
              borderLeftColor: theme('colors.gray.300'),
              color: theme('colors.gray.600'),
              fontStyle: 'italic',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              'color': theme('colors.indigo.400'),
              '&:hover': {
                color: theme('colors.indigo.300'),
              },
            },
            h1: { color: theme('colors.gray.100') },
            h2: { color: theme('colors.gray.100') },
            h3: { color: theme('colors.gray.100') },
            h4: { color: theme('colors.gray.100') },
            h5: { color: theme('colors.gray.100') },
            h6: { color: theme('colors.gray.100') },
            strong: { color: theme('colors.gray.100') },

            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
              color: theme('colors.gray.400'),
              fontStyle: 'italic',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};

export default config;
