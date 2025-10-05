#!/usr/bin/env node
// support/mobile/run-mobile-tests.js

require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { spawnInherit } = require("./utils/process-utils.js");
const { startAppium, getAppiumPidFilePath } = require("./appium-server.js");
const startAndroid = require("./start-android-device.js");
const stopEmulator = require("./stop-android-emulator.js");
const { runAllure } = require("../report/run-allure-report.js");

let OPEN_ALLURE;
let CLEAR_OLD_RESULTS;
let PLATFORM;
let TARGET_DEVICE;
let DEVICE_PROFILE_NAME;
let TAG;

/**
 * Main entry point for running mobile tests with configurable options.
 *
 * This function:
 * - Parses command-line arguments for test configuration.
 * - Validates required arguments and exits if any are missing.
 * - Optionally clears old test and Appium results.
 * - Starts the Appium server.
 * - Depending on the platform (android or ios):
 *   - Starts the Android emulator/device or prepares for iOS.
 *   - Runs the appropriate test suite with environment variables.
 * - Handles errors during test execution.
 * - Ensures cleanup by stopping the emulator and Appium server.
 * - Generates an Allure report after tests complete.
 * - Exits the process with the test run's exit code.
 *
 * @async
 * @function main
 * @returns {Promise<void>} Resolves when the process exits (never actually returns).
 */
async function main() {
  const args = process.argv.slice(2);

  parseArgs(args);

  await clearOldReports();

  await startAppiumProcess();

  let testExitCode = 0;
  try {
    switch (PLATFORM) {
      case "android": {
        console.log("▶ Starting Android device/emulator...");
        await startAndroid(TARGET_DEVICE);
        await new Promise((r) => setTimeout(r, 3000));

        const androidEnvVars = {
          ...process.env,
          ANDROID_PROFILE: DEVICE_PROFILE_NAME,
          TEST_LEVEL: "android",
          TAG: TAG
        };

        const args = ["cucumber-js", "-p", "android", "--parallel", "1", "--require", "steps", "--require", "support/world.js", "--tags", TAG];

        console.log("▶ Running Android tests...");
        const exitCode = await spawnInherit("npx", args, { env: androidEnvVars });
        console.log("Exit code:", exitCode);

        break;
      }

      case "ios": {
        const iosEnvVars = {
          ...process.env,
          IOS_PROFILE: DEVICE_PROFILE_NAME,
          TEST_LEVEL: "ios",
          TAG: TAG
        };

        const args = ["cucumber-js", "-p", "ios", "--parallel", "1", "--require", "steps", "--require", "support/world.js", "--tags", TAG];

        console.log("▶ Running iOS tests...");
        const exitCode = await spawnInherit("npx", args, { env: iosEnvVars });
        console.log("Exit code:", exitCode);

        break;
      }

      default:
        throw new Error("platform must be android or ios");
    }
  } catch (err) {
    console.error("Error while running tests:", err.message || err);
    testExitCode = testExitCode || 1;
  } finally {
    stopEmulatorProcess();
    stopAppiumProcess();

    await generateAllureReport();

    process.exit(testExitCode || 0);
  }
}

if (require.main === module) main();
module.exports = main;

/**
 * Starts the Appium server process asynchronously.
 * Logs the process start and handles any errors by logging them and exiting the process.
 *
 * @async
 * @function startAppiumProcess
 * @returns {Promise<void>} Resolves when Appium starts successfully, otherwise exits the process.
 */
async function startAppiumProcess() {
  console.log("🚀 Starting Appium...");
  try {
    await startAppium();
  } catch (err) {
    console.error("Failed to start Appium:", err.message || err);
    process.exit(1);
  }
}

/**
 * Stops the Appium process if it is running by reading its PID from a file,
 * sending a SIGTERM signal to terminate it, and removing the PID file.
 * Logs the action and handles any errors gracefully.
 */
function stopAppiumProcess() {
  try {
    if (fs.existsSync(getAppiumPidFilePath)) {
      const pid = Number(fs.readFileSync(getAppiumPidFilePath, "utf8").trim());
      if (pid) {
        process.kill(pid, "SIGTERM");
        console.log(`🛑 Stopped Appium (PID ${pid})`);
      }
      fs.unlinkSync(getAppiumPidFilePath);
    }
  } catch (e) {
    console.warn("Error stopping appium:", e.message || e);
  }
}

/**
 * Attempts to stop the running emulator process.
 * Logs a message before stopping and handles any errors gracefully.
 * If stopping the emulator fails, a warning is logged with the error message.
 */
function stopEmulatorProcess() {
  try {
    console.log("🛑 Stopping emulator if exists...");
    stopEmulator();
  } catch (e) {
    console.warn("Failed to stop emulator:", e.message || e);
  }
}

/**
 * Clears old test reports and logs if the CLEAR_OLD_RESULTS environment variable is set to "true".
 *
 * This function performs the following actions:
 * 1. Logs a message indicating that old results are being cleaned.
 * 2. Attempts to remove Appium logs by running the "appium:remove-logs-sh" npm script.
 * 3. Attempts to remove Allure results for the specified platform by running the "allure:remove-results:${PLATFORM}" npm script.
 *
 * Both removal actions are attempted independently, and errors are silently ignored.
 *
 * @async
 * @function clearOldReports
 * @returns {Promise<void>} Resolves when the cleanup process is complete.
 */
async function clearOldReports() {
  if (CLEAR_OLD_RESULTS === "true") {
    console.log("🗑 Cleaning old results...");
    try {
      await spawnInherit("npm", ["run", "appium:remove-logs-sh"]);
    } catch (e) {}
    try {
      await spawnInherit("npm", ["run", `allure:remove-results:${PLATFORM}`]);
    } catch (e) {}
  }
}

/**
 * Generates an Allure report for mobile tests by executing a shell script.
 * Logs progress to the console and handles any errors that occur during report generation.
 *
 * @async
 * @function generateAllureReport
 * @returns {Promise<void>} Resolves when the report generation is complete.
 */
async function generateAllureReport() {
  try {
    await runAllure(["open_allure=" + OPEN_ALLURE, "test_level=mobile"]);
  } catch (e) {
    console.warn("⚠️ Failed generating Allure report:", e.message || e);
  }
}

/**
 * Parses an array of command-line arguments in the form of key=value pairs
 * and assigns their values to corresponding global variables.
 *
 * Required arguments:
 * - open_allure
 * - clear_old_results
 * - platform
 * - target_device
 * - device_profile_name
 * - tag
 *
 * Unknown keys will trigger a warning and be ignored.
 *
 * @param {string[]} args - Array of arguments in the format "key=value".
 */
function parseArgs(args) {
  for (const arg of args) {
    const [key, value] = arg.split("=");

    switch (key) {
      case "open_allure":
        OPEN_ALLURE = value;
        break;
      case "clear_old_results":
        CLEAR_OLD_RESULTS = value;
        break;
      case "platform":
        PLATFORM = value;
        break;
      case "target_device":
        TARGET_DEVICE = value;
        break;
      case "device_profile_name":
        DEVICE_PROFILE_NAME = value;
        break;
      case "tag":
        TAG = value;
        break;
      default:
        console.warn(`⚠️ Unknown argument ignored: ${key}`);
    }
  }

  validateArgs();
}

/**
 * Validates that all required environment variables for running mobile tests are set.
 * If any required argument is missing, logs an error message with usage instructions and exits the process.
 *
 * Required arguments (expected as environment variables):
 * - open_allure: Whether to open Allure report (e.g., "true" or "false").
 * - clear_old_results: Whether to clear old test results (e.g., "true" or "false").
 * - platform: The mobile platform to test on (e.g., "android" or "ios").
 * - target_device: The target device type (e.g., "emulator" or "real").
 * - device_profile_name: The name of the device profile to use.
 * - TAG: The tag to filter tests (e.g., "@android").
 *
 * @throws Will terminate the process with exit code 1 if any required argument is missing.
 */
function validateArgs() {
  const required = {
    open_allure: OPEN_ALLURE,
    clear_old_results: CLEAR_OLD_RESULTS,
    platform: PLATFORM,
    target_device: TARGET_DEVICE,
    device_profile_name: DEVICE_PROFILE_NAME,
    tag: TAG
  };

  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    console.error(`❌ Missing arguments: ${missing.join(", ")}`);
    console.error(
      "\nUsage:\n" +
        "  node support/mobile/run-mobile-tests.js \\\n" +
        "    open_allure=true \\\n" +
        "    clear_old_results=true \\\n" +
        "    platform=android \\\n" +
        "    target_device=emulator \\\n" +
        "    device_profile_name=emulator_pixel_android15 \\\n" +
        '    tag="@android"\n'
    );
    process.exit(1);
  }
}
