#!/usr/bin/env node
// support/report/run-allure-report.js

const { execSync } = require("child_process");

let OPEN_ALLURE;
let TEST_LEVEL;

/**
 * Main function to generate and open the Allure Report.
 *
 * This function parses command-line arguments, generates the Allure report
 * based on the specified test level, and optionally opens the report.
 * Logs progress and handles errors gracefully.
 *
 * Usage examples:
 *   node support/report/run-allure-report.js open_allure=true test_level=api|web|mobile
 *
 * @async
 * @function main
 * @returns {Promise<void>} Resolves when the report is generated and opened, or exits on error.
 */
async function runAllure(passedArgs = null) {
  console.log("✨✨ Generating Allure Report ✨✨...");
  console.log("-----------------------------------");

  const args = passedArgs || process.argv.slice(2);
  parseArgs(args);

  try {
    generateAllure(TEST_LEVEL);
    openAllure(OPEN_ALLURE);
    console.log("✅ All done.");
  } catch (err) {
    console.error("❌ Error while generating or opening Allure Report:", err.message);
    process.exit(1);
  }
}

/**
 * Opens the Allure report if the OPEN_ALLURE environment variable is set to "true".
 *
 * @param {string} OPEN_ALLURE - The value indicating whether to open the Allure report ("true" to open).
 */
function openAllure(OPEN_ALLURE) {
  console.log(`🎚️ OPEN_ALLURE is set to ${OPEN_ALLURE}`);
  if (OPEN_ALLURE === "true") {
    console.log("📂 Opening Allure Report...");
    execSync("npm run allure:open", { stdio: "inherit" });
  } else {
    console.log("OPEN_ALLURE is not 'true', skipping...");
  }
}

/**
 * Generates an Allure report based on the specified test level.
 *
 * Executes the appropriate npm script to generate the Allure report for API, web, or mobile tests.
 * If an invalid test level is provided, logs an error and exits the process.
 *
 * @param {string} TEST_LEVEL - The level of tests to generate the report for. Valid options are "api", "web", or "mobile".
 */
function generateAllure(TEST_LEVEL) {
  switch (TEST_LEVEL) {
    case "api":
      execSync("npm run allure:generate-report:api", { stdio: "inherit" });
      break;
    case "web":
      execSync("npm run allure:generate-report:web", { stdio: "inherit" });
      break;
    case "mobile":
      execSync("npm run allure:generate-report:mobile", { stdio: "inherit" });
      break;
    default:
      console.error("❌ Invalid test level. Valid options: api, web, mobile");
      process.exit(1);
  }
}

/**
 * Parses an array of argument strings in the format "key=value" and sets corresponding global variables.
 * Recognized keys are "open_allure" and "test_level". Unrecognized keys are ignored with a warning.
 * After parsing, validates the arguments.
 *
 * @param {string[]} args - Array of argument strings to parse.
 */
function parseArgs(args) {
  for (const arg of args) {
    const [key, value] = arg.split("=");
    switch (key) {
      case "open_allure":
        OPEN_ALLURE = value;
        break;
      case "test_level":
        TEST_LEVEL = value;
        break;
      default:
        console.warn(`⚠️ Unknown argument ignored: ${key}`);
    }
  }
  validateArgs();
}

/**
 * Validates the presence of required environment variables OPEN_ALLURE and TEST_LEVEL.
 * If any are missing, logs an error message with usage instructions and exits the process.
 *
 * @throws Will terminate the process with exit code 1 if required arguments are missing.
 */
function validateArgs() {
  const missing = [];
  if (!OPEN_ALLURE) missing.push("open_allure");
  if (!TEST_LEVEL) missing.push("test_level");

  if (missing.length > 0) {
    console.error(`❌ Missing arguments: ${missing.join(", ")}`);
    console.error("---> Usage: node ./support/report/run-allure-report.js open_allure=true|false test_level=api|web|mobile");
    process.exit(1);
  }
}

module.exports = {
  runAllure
};
