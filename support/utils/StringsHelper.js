// support/utils/StringsHelper.js

/**
 * Removes surrounding quotes from a string if they exist.
 * @param {string} value - The input string.
 * @returns {string} - The string without surrounding quotes.
 */
function removeQuotes(value) {
  if (!value) return value;
  return value.replace(/^["'](.*)["']$/, '$1');
}

module.exports = {
  removeQuotes
};
