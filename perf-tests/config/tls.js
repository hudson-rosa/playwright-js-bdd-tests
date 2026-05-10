// - Transport Layer Security CONFIGURATION - perf-tests/config/tls.js

export function getTlsConfig() {
  return [
    {
      cert: open('../../resources/cert/my_application_certificate.crt'),
      key: open('../../resources/cert/my_application_certificate.key'),
    },
  ];
}