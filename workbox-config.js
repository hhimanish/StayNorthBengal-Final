// workbox-config.js
module.exports = {
  globDirectory: 'frontend/dist',
  globPatterns: [
    '**/*.{js,css,html,svg,ico,json,woff,woff2,png,jpg,jpeg}',
    'public/vouchers/**/*.pdf'
  ],
  swDest: 'frontend/dist/sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/maps\.googleapis\.com\/maps\/vt\/.*$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-maps-tiles',
        expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 }
      }
    },
    {
      urlPattern: /\/vouchers\/.*\.pdf$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'vouchers',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 24 * 60 * 60 }
      }
    },
    {
      urlPattern: ({request}) => request.destination === 'script' || request.destination === 'style' || request.destination === 'image',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-assets',
        expiration: { maxEntries: 300, maxAgeSeconds: 7 * 24 * 60 * 60 }
      }
    }
  ]
};
