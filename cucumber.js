module.exports = {
  default: {
    require: ["./steps/**/*.js"],
    format: ["progress"],
    paths: ["./features/**/*.feature"],
    worldParameters: {}
  },
  chromium: {
    ...this.default,
    env: { BROWSER: "chromium" }
  },
  firefox: {
    ...this.default,
    env: { BROWSER: "firefox" }
  },
  webkit: {
    ...this.default,
    env: { BROWSER: "webkit" }
  }
};
