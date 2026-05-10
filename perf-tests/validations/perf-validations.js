// - VALIDATIONS - tests/validations/perf-validations.js
import http from 'k6/http';
import { sleep, check } from 'k6';

export function validateXRateLimitResponse(res) {
  const rateLimitRemaining = res.headers['X-RateLimit-Remaining'];
  const retryAfter = res.headers['Retry-After'];

  // --- CHECKS ---
  check(res, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,

    'rate limit header present': () => rateLimitRemaining !== undefined,

    '429 has retry-after': (r) =>
      r.status !== 429 || retryAfter !== undefined,
  });

  // --- DEBUG LOGGING (optional) ---
  if (res.status === 429) {
    console.log(`Rate limited. Retry after: ${retryAfter}`);
  }

  sleep(1);
}

