/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        // match width of adsense
        '7xl': '79rem',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')],
};
