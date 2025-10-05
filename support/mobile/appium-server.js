#!/usr/bin/env node
// support/mobile/appium-server.js

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { spawnDetached, waitForHttp } = require("./utils/process-utils");
const protocol = process.env.APPIUM_PROTOCOL || "http";
const host = process.env.APPIUM_HOSTNAME || "127.0.0.1";
const port = parseInt(process.env.APPIUM_SERVER_PORT || 4723, 10);
const appium_url = `${protocol}://${host}:${port}`;

let childAppiumProcess;

function getAppiumPidFilePath() {
  return "/tmp/appium_pid.txt";
}

async function isRunning() {
  try {
    const res = await axios.get(`${appium_url}/status`, { timeout: 1000 });
    return res.status === 200 && res.data.value?.build;
  } catch (err) {
    return false;
  }
}

async function startAppium() {
  const logFile = path.resolve(process.cwd(), "appium.log");
  const errFile = path.resolve(process.cwd(), "appium.err");

  ensureFilesExist();

  childAppiumProcess = spawnDetached("npx", ["appium", "-p", `${port}`], {
    stdio: ["ignore", fs.openSync(logFile, "a"), fs.openSync(errFile, "a")],
    shell: true
  });

  await waitForServerStatus();

  writePidForCleanup();

  function ensureFilesExist() {
    fs.closeSync(fs.openSync(logFile, "a"));
    fs.closeSync(fs.openSync(errFile, "a"));
  }

  async function waitForServerStatus() {
    const statusUrl = `${appium_url}/status`;
    try {
      await waitForHttp(statusUrl, { timeout: 20000, interval: 500 });
      console.log(`✅ Appium started and responsive at ${statusUrl} (PID ${childAppiumProcess.pid})`);
    } catch (err) {
      console.error("❌ Appium did not respond in time:", err.message);
      throw err;
    }
  }

  function writePidForCleanup() {
    fs.writeFileSync(getAppiumPidFilePath(), String(childAppiumProcess.pid));
  }

  if (require.main === module) {
    startAppium().catch((e) => {
      console.error(e);
      process.exit(1);
    });
  }
}

function stopAppium() {
  if (childAppiumProcess) {
    childAppiumProcess.kill("SIGTERM");
    console.log("🛑 Appium process stopped");
    childAppiumProcess = null;
  }
}

module.exports = { startAppium, stopAppium, isRunning, getAppiumPidFilePath };
