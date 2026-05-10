// - SCENARIOS - perf-tests/config/scenarios.js

export const scenarios = {

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
};