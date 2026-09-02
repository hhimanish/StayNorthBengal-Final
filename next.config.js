// next.config.js
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};
