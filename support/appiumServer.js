require("dotenv").config();

const axios = require("axios");
const { spawn } = require("child_process");
const host = process.env.APPIUM_HOSTNAME;
const port = parseInt(process.env.APPIUM_SERVER_PORT || 4723);
let appiumProcess;

class AppiumServer {
  static async isRunning() {
    try {
      const res = await axios.get(`http://${host}:${port}/status`, { timeout: 1000 });
      return res.status === 200 && res.data.value?.build;
    } catch (err) {
      return false;
    }
  }

  static startServer() {
    if (appiumProcess) return;

    appiumProcess = spawn("npx", ["appium", "-p", port], {
      detached: true,
      stdio: ["ignore", fs.openSync("appium.log", "a"), fs.openSync("appium.err", "a")],
      shell: true
    });
    appiumProcess.unref();

    console.log(`✅ Appium process started on port ${port}`);
  }

  static async ensureIsRunning() {
    try {
      await this.isRunning(host, port);
      console.log("ℹ️ Appium already running");
    } catch {
      console.log("⚡ Appium not running, starting...");
      this.startServer();
    }
    await this.delay(5000);
  }

  static stopServer() {
    if (appiumProcess) {
      appiumProcess.kill("SIGTERM");
      console.log("🛑 Appium process stopped");
      appiumProcess = null;
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = AppiumServer;
