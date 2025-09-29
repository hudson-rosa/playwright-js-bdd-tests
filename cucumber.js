// module.exports = {
const path = require("path");

function buildConfig(resultsDir) {
  return {
    require: ["./support/world.js", "./steps/**/*.js", "support/**/*.js", "ts-node/register"],
    paths: ["./features/**/*.feature"],
    parallel: 3,
    timeout: 30000,
    worldParameters: {},
    format: ["progress", "allure-cucumberjs/reporter"],
    formatOptions: {
      resultsDir, // resultsDir: "allure-results",
      labels: [
        {
          pattern: [/@epic:(.*)/],
          name: "epic"
        },
        {
          pattern: [/@severity:(.*)/],
          name: "severity"
        },
        {
          pattern: [/.*/],
          name: "browser",
          value: process.env.BROWSER || "unknown"
        }
      ],
      links: {
        issue: {
          pattern: [/@issue:(.*)/],
          urlTemplate: "https://issues.example.com/%s",
          nameTemplate: "ISSUE %s"
        },
        tms: {
          pattern: [/@tms:(.*)/],
          urlTemplate: "https://tms.example.com/%s"
        },
        jira: {
          pattern: [/@jira:(.*)/],
          urlTemplate: (v) => `https://jira.example.com/browse/${v}`
        }
      },
      categories: [
        {
          name: "foo",
          messageRegex: "bar",
          traceRegex: "baz"
        }
      ]
    }
  };
}


module.exports = {
  chromium: buildConfig("allure-results/chromium"),
  firefox: buildConfig("allure-results/firefox"),
  webkit: buildConfig("allure-results/webkit"),
  android: buildConfig("allure-results/android"),
  ios: buildConfig("allure-results/ios"),
  api: buildConfig("allure-results/api")
};
