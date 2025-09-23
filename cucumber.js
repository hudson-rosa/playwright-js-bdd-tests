module.exports = {
  default: {
    require: ["./support/world.js", "./steps/**/*.js", "support/**/*.js", "ts-node/register"],
    paths: ["./features/**/*.feature"],
    parallel: 3,
    timeout: 20000,
    worldParameters: {},
    format: ["progress", "allure-cucumberjs/reporter"],
    formatOptions: {
      resultsDir: "allure-results",
      labels: [
        {
          pattern: [/@epic:(.*)/],
          name: "epic",
        },
        {
          pattern: [/@severity:(.*)/],
          name: "severity",
        },
      ],
      links: {
        issue: {
          pattern: [/@issue:(.*)/],
          urlTemplate: "https://issues.example.com/%s",
          nameTemplate: "ISSUE %s",
        },
        tms: {
          pattern: [/@tms:(.*)/],
          urlTemplate: "https://tms.example.com/%s",
        },
        jira: {
          pattern: [/@jira:(.*)/],
          urlTemplate: (v) => `https://jira.example.com/browse/${v}`,
        },
      },
      categories: [
        {
          name: "foo",
          messageRegex: "bar",
          traceRegex: "baz"
        },
      ],
    },
  },
  chromium: {
    ...this.default,
    env: { BROWSER: "chromium", ALLURE_RESULTS_DIR: "/chromium" }
  },
  firefox: {
    ...this.default,
    env: { BROWSER: "firefox", ALLURE_RESULTS_DIR: "/firefox" }
  },
  webkit: {
    ...this.default,
    env: { BROWSER: "webkit", ALLURE_RESULTS_DIR: "/webkit" }
  }
};
