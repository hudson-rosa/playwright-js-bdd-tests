// perf-tests/data/endpoints.js

export const endpoints = {
  demo: {
    url: 'https://httpbin.org/get',
    method: 'GET',
    params: {}
  },

  MySpecificServiceName: {
    url: 'https://your-another-endpoint.com/api',
    method: 'GET',
    params: {
      auth: 'basic',
      username: '<ADD-THE-USERNAME>',
      password: '<ADD-THE-PASSWORD>',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  },
};