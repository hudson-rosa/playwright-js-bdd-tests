// - BASE TEST FILE - tests/performance-tests/ddos-base-test.js
import http from 'k6/http';
import { sleep, check } from 'k6';
import { getPenTestOptions } from '../config/options.js';
import { validateXRateLimitResponse } from '../validations/perf-validations.js';
import { endpoints } from '../data/endpoints.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = getPenTestOptions();

const endpointName = __ENV.ENDPOINT;
const service = endpoints[endpointName];

if (!service) {
  throw new Error(
    `Endpoint "${endpointName}" not found in endpoints.js`
  );
}

export default function () {
  const res = http.get(service.url, service.params);
  validateXRateLimitResponse(res);
  sleep(1);
}

export function handleSummary(data) {
  return {
    "audit-perfs/reports/report.html": htmlReport(data),
  };
}