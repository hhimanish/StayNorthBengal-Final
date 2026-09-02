#!/usr/bin/env bash
set -e

# 1. TypeScript type check
npm run typecheck

# 2. Lint
npm run lint

# 3. Build for production
npm run build

# 4. Run unit tests (Jest)
npm test

# 5. Load test with k6 (requires k6 installed)
# Adjust BASE_URL if needed
k6 run tests/load/payout.js

# 6. OWASP ZAP baseline scan (requires zap-cli installed)
# Replace with your deployed preview URL or localhost
ZAP_URL=${ZAP_URL:-http://localhost:3000}
zap-cli quick-scan -r zap_report.html $ZAP_URL

echo "Verification pipeline completed successfully."
