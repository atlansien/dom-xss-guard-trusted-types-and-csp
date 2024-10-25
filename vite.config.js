export default {
  server: {
    headers: {
      'Content-Security-Policy':
        "require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example",
    },
  },
};
