// tests/perf/ddos-logic.js
import http from 'k6/http';
import { sleep, check } from 'k6';

// --- CONFIG ---
const BASE_URL = 'https://httpbin.org/get';

// --- TEST SCENARIOS ---
export const options = {
  scenarios: {

    // 1. Baseline load
    normal_load: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '1m', target: 20 },
        { duration: '2m', target: 50 },
        { duration: '1m', target: 0 },
      ],
    },

    // 2. Spike (DDoS-like)
    spike_test: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      stages: [
        { duration: '30s', target: 500 }, // sudden spike
        { duration: '1m', target: 500 },
        { duration: '30s', target: 0 },
      ],
      preAllocatedVUs: 200,
      maxVUs: 1000,
    },

    // 3. Sustained load (soak)
    soak_test: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 100,
      maxVUs: 500,
    },
  },
};

// --- TEST LOGIC ---
export default function () {
  const res = http.get(BASE_URL);

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
