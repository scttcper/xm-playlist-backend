// eslint-disable-next-line @typescript-eslint/no-var-requires
const whitelister = require('purgecss-whitelister');

const purgecss = [
  '@fullhuman/postcss-purgecss',
  {
    content: [
      './components/**/*.tsx',
      './pages/**/*.tsx',
    ],
    whitelist: whitelister(
      'node_modules/@fortawesome/fontawesome-svg-core/styles.css',
    ),
    defaultExtractor: content => content.match(/[\w-/.:]+(?<!:)/g) || [],
  },
];
module.exports = {
  plugins: [
    'postcss-import',
    'tailwindcss',
    'autoprefixer',
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
