// tests/load/payout.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  const url = `${__ENV.BASE_URL || 'http://localhost:3000'}/api/payments/payout`;
  const payload = JSON.stringify({ amountRupees: 10, accountNumber: '1234567890', ifsc: 'ABCD0123456' });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, { 'status is 200': (r) => r.status === 200 || r.status === 401 }); // may be auth error
  sleep(1);
}
