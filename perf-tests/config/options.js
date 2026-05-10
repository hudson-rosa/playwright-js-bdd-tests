// - OPTIONS - perf-tests/config/options.js

import { getTlsConfig } from './tls.js';
import { scenarios as pentestScenarios } from './scenarios.js';

export function getPenTestOptions() {
  return {
    tlsAuth: getTlsConfig(),
    scenarios: pentestScenarios,
  }
}
