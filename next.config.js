// next.config.js
module.exports = {
  reactStrictMode: true,
  // experimental options removed as they are now defaults
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};
