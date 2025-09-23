const { remote } = require("webdriverio");
const path = require("path");
require("dotenv").config();

const DEFAULT_SYSTEM_PORT = 58200;

class AppiumDriverSetup {
  static async getAndroidDriver() {
    const systemPort = (process.env.APPIUM_DEFAULT_SYSTEM_PORT ? parseInt(process.env.APPIUM_DEFAULT_SYSTEM_PORT) : DEFAULT_SYSTEM_PORT) + Math.floor(Math.random() * 20);
    const caps = {
      platformName: "Android",
      "appium:platformVersion": process.env.ANDROID_PLATFORM_VERSION || "16.0",
      "appium:deviceName": process.env.ANDROID_DEVICE || "Pixel_6",
      "appium:udid": process.env.ANDROID_APP_UDID || "25261FDF60045T",
      "appium:automationName": "UiAutomator2",
      "appium:app": path.join(__dirname, "../apps/ApiDemos-debug.apk"),
      "appium:appPackage": process.env.ANDROID_APP_PACKAGE,
      "appium:appActivity": process.env.ANDROID_APP_ACTIVITY,
      "appium:noReset": false,
      "appium:fullReset": false,
      "appium:autoGrantPermissions": true,
      "appium:newCommandTimeout": parseInt(process.env.APPIUM_COMMAND_TIMEOUT || 3600),
      "appium:systemPort": systemPort
    };

    console.log("⚡ Launching Android driver on systemPort:", systemPort);

    const driver = await remote({
      protocol: process.env.APPIUM_PROTOCOL || "http",
      hostname: process.env.APPIUM_HOSTNAME || "127.0.0.1", // where Appium server is running
      port: parseInt(process.env.APPIUM_SERVER_PORT || 4723),
      path: process.env.APPIUM_SERVER_PATH || "/",
      capabilities: caps
    });

    return driver;
  }
}

module.exports = AppiumDriverSetup;
