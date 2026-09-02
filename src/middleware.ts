// src/middleware.ts

import { middleware as requireHost } from './middleware/requireHost';

export { requireHost as middleware };

// Apply the host‑guard middleware to wallet pages and payout endpoint
export const config = {
  matcher: [
    '/wallet/:path*',
    '/api/payments/payout'
  ]
};
