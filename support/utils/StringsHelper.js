// support/utils/StringsHelper.js

const { Status } = require("@cucumber/cucumber");

/**
 * Removes surrounding quotes from a string if they exist.
 * @param {string} value - The input string.
 * @returns {string} - The string without surrounding quotes.
 */
function removeQuotes(value) {
  if (!value) return value;
  return value.replace(/^["'](.*)["']$/, "$1");
}

/**
 * Return the test status with an emoji.
 * @param {object} scenario - The Cucumber scenario object.
 * @returns {string} - The test status with an emoji.
 */
function testStatus(scenario) {
  switch (scenario.result?.status) {
    case Status.UNKNOWN:
      return `${Status.UNKNOWN} ❓`;
    case Status.PASSED:
      return `${Status.PASSED} 🟢`;
    case Status.SKIPPED:
      return `${Status.SKIPPED} ⏭️`;
    case Status.PENDING:
      return `${Status.PENDING} ⏳`;
    case Status.UNDEFINED:
      return `${Status.UNDEFINED} 🤔`;
    case Status.AMBIGUOUS:
      return `${Status.AMBIGUOUS} ⚠️`;
    case Status.FAILED:
      return `${Status.FAILED} 🔴`;
    default:
      return `${Status.UNKNOWN} ❓`;
  }
}

module.exports = {
  removeQuotes,
  testStatus
};
