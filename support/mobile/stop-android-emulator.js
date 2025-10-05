#!/usr/bin/env node
// support/mobile/stop-android-emulator.js

const fs = require("fs");
const { execSync } = require("child_process");

function getAndroidEmulatorPidFilePath() {
  return "/tmp/emulator_pid.txt";
}

/**
 * Stops a running Android emulator process if its PID file exists.
 *
 * This function checks for the existence of a PID file at "/tmp/emulator_pid.txt".
 * If found, it reads the PID, attempts to gracefully terminate the emulator process
 * using SIGTERM, and after a short delay, forcefully kills the process with SIGKILL
 * if it is still running. The PID file is deleted after the operation.
 *
 * Logs informative messages to the console throughout the process.
 *
 * @function
 */
function stopEmulatorIfExists() {
  const pidFile = getAndroidEmulatorPidFilePath();

  if (!fs.existsSync(pidFile)) {
    console.log("⚠️  No emulator PID file found... Nothing to stop.");
    return;
  }

  const emulatorPid = Number(fs.readFileSync(pidFile, "utf8").trim());
  if (!emulatorPid) {
    console.log("PID file empty or invalid.");
    return;
  }

  try {
    process.kill(emulatorPid, "SIGTERM");
    console.log(`Sent SIGTERM to emulator PID ${emulatorPid}`);
    waitToKillStillAlivePid();
  } catch (err) {
    console.warn("Error stopping emulator:", err.message);
  } finally {
    try {
      fs.unlinkSync(pidFile);
    } catch (e) {}
  }

  function waitToKillStillAlivePid() {
    setTimeout(() => {
      try {
        process.kill(emulatorPid, 0);
        console.log(`Emulator PID ${emulatorPid} still alive; forcing SIGKILL`);
        process.kill(emulatorPid, "SIGKILL");
      } catch (e) {}
    }, 2000);
  }
}

if (require.main === module) {
  stopEmulatorIfExists();
}

module.exports = stopEmulatorIfExists;
