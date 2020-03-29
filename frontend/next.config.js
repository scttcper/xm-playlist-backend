/* eslint-disable @typescript-eslint/no-var-requires */
const withSass = require('@zeit/next-sass');
const withPurgeCss = require('next-purgecss');

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
module.exports = withSass(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  withPurgeCss({
    compress: false,
    purgeCssEnabled: ({ dev, isServer }) => (!dev && !isServer),
  }),
);
