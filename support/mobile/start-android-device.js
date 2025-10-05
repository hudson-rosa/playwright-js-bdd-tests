#!/usr/bin/env node
// support/mobile/start-android-device.js

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { spawnDetached } = require("./utils/process-utils.js");
const { listConnectedDevices, listEmulatorAvds, waitForDeviceReady } = require("./utils/adb-utils.js");

let childEmulatorProcess;

function getAndroidEmulatorPidFilePath() {
  return "/tmp/emulator_pid.txt";
}

/**
 * Starts an Android device based on the specified target type.
 *
 * If `targetDevice` is "real", checks for connected real devices and logs their presence.
 * If `targetDevice` is "emulator", starts the first available Android Virtual Device (AVD) emulator,
 * logs output to a file, waits for the emulator to boot, and persists the emulator's PID for cleanup.
 *
 * @async
 * @param {"real"|"emulator"} targetDevice - The type of device to start ("real" for a physical device, "emulator" for an AVD).
 * @throws {Error} If `targetDevice` is not provided, is invalid, or if no devices/emulators are found.
 */
async function startAndroid(targetDevice) {
  if (!targetDevice) throw new Error("target_device argument is required (real|emulator)");

  if (targetDevice === "real") {
    return handleRealDevice();
  }

  if (targetDevice === "emulator") {
    return await handleEmulatorDevice();
  }

  throw new Error("Invalid targetDevice. Use 'real' or 'emulator'");
}

if (require.main === module) {
  const arg = process.argv.slice(2)[0];
  // expected format: target_device=<value> or just the value
  let targetDevice = arg && arg.includes("=") ? arg.split("=")[1] : arg;
  startAndroid(targetDevice)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err.message || err);
      process.exit(1);
    });
}

module.exports = startAndroid;

/**
 * Starts the first available Android Virtual Device (AVD) emulator, waits for it to boot, and logs its output.
 *
 * - Throws an error if no AVDs are found.
 * - Logs emulator output to "android_device_run.log" in the current working directory.
 * - Writes the emulator process PID to "/tmp/emulator_pid.txt" for cleanup purposes.
 * - Waits up to 2 minutes for the emulator to be ready.
 *
 * @async
 * @throws {Error} If no AVDs are found.
 * @returns {Promise<void>} Resolves when the emulator is ready or the wait times out.
 */
async function handleEmulatorDevice() {
  const avds = listEmulatorAvds();

  if (!avds.length) throw new Error("❌ No AVD found. Create one in Android Studio first.");
  const first = avds[0];
  console.log("🚀 Starting emulator:", first);

  const logPath = path.resolve(process.cwd(), "android_device_run.log");
  fs.closeSync(fs.openSync(logPath, "a"));
  const args = ["-avd", first, "-netdelay", "none", "-netspeed", "full"];

  childEmulatorProcess = spawnDetached("emulator", args, {
    stdio: ["ignore", fs.openSync(logPath, "a"), fs.openSync(logPath, "a")],
    shell: true
  });

  console.log(`⏳ Waiting for emulator to boot (PID ${childEmulatorProcess.pid})...`);

  writePidForCleanup();

  return await waitEmulatotReady();

  async function waitEmulatotReady() {
    try {
      await waitForDeviceReady(120000);
      console.log(`✅ Emulator ${first} booted (PID ${childEmulatorProcess.pid})`);
    } catch (err) {
      console.warn("⚠️ Emulator did not boot in time (PID is written):", err.message);
    }
    return;
  }

  function writePidForCleanup() {
    fs.writeFileSync(getAndroidEmulatorPidFilePath(), String(childEmulatorProcess.pid), { encoding: "utf8" });
  }
}

/**
 * Checks for connected real Android devices and logs their identifiers.
 * Throws an error if no devices are connected.
 *
 * @throws {Error} If no real devices are connected.
 */
function handleRealDevice() {
  const devices = listConnectedDevices();
  if (!devices.length) {
    throw new Error("❌ No real devices connected");
  }
  console.log("✅ Real device(s) connected:");
  devices.forEach((d) => console.log("  " + d));
  return;
}
