require("dotenv").config();

const axios = require("axios");

class AppiumServer {
  
  async isAppiumRunning(host = process.env.APPIUM_HOSTNAME, port = parseInt(process.env.APPIUM_SERVER_PORT)) {
    try {
      const res = await axios.get(`http://${host}:${port}/status`, { timeout: 1000 });
      return res.status === 200 && res.data.value?.build;
    } catch (err) {
      return false;
    }
  }
}

// Usage
(async () => {
  const appiumServer = new AppiumServer();
  const running = await appiumServer.isAppiumRunning();
  if (running) {
    console.log("✅ Appium server is running");
  } else {
    console.log("❌ Appium server is NOT running");
  }
})();

module.exports = AppiumServer;
