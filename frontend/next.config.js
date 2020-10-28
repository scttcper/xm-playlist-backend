module.exports = {
  compress: false,
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/_next/image',
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=864000, immutable',
          },
        ],
      },
    ];
  },
};
