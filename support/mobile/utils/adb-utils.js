// support/mobile/utils/adb-utils.js

const { execSync } = require("child_process");

/**
 * Lists all connected Android devices (excluding emulators) by parsing the output of `adb devices -l`.
 *
 * @returns {string[]} An array of UDID strings representing connected physical devices.
 */
function listConnectedDevices() {
  const out = execSync("adb devices -l", { encoding: "utf8" });
  const filterLinesWithDeviceButNoEmulator = out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("List of devices"));
  console.log("🔎 Listing devices connected...");
  return filterLinesWithDeviceButNoEmulator;
}

/**
 * Lists all available Android Virtual Device (AVD) names for the emulator.
 *
 * Executes the `emulator -list-avds` command and returns an array of AVD names.
 *
 * @returns {string[]} An array of available AVD names.
 * @throws {Error} If the command fails to execute.
 */
function listEmulatorAvds() {
  const out = execSync("emulator -list-avds", { encoding: "utf8" });
  const lineBreak = /\r?\n/;
  console.log("🔎 Listing AVDs - Emulator names...");
  return out
    .split(lineBreak)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Waits for an Android device or emulator to be fully booted and ready for use.
 * This function blocks execution until the device is connected and the system property
 * `sys.boot_completed` is set to "1", or until the specified timeout is reached.
 *
 * @param {number} [timeoutMs=120000] - The maximum time to wait for the device to be ready, in milliseconds.
 * @returns {boolean} Returns true if the device is ready before the timeout.
 * @throws {Error} Throws an error if the device does not become ready within the timeout period.
 */
function waitForDeviceReady(timeoutMs = 120000) {
  const start = Date.now();

  execSync("adb wait-for-device", { stdio: "ignore" });

  while (Date.now() - start < timeoutMs) {
    try {
      const res = execSync("adb shell getprop sys.boot_completed", { encoding: "utf8" }).trim();
      if (res === "1") return true;
    } catch (err) {}
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000); // small sleep
  }
  throw new Error("⩇⩇:⩇⩇ ⏱️ Timeout waiting for emulator device to boot");
}

module.exports = {
  listConnectedDevices,
  listEmulatorAvds,
  waitForDeviceReady
};
