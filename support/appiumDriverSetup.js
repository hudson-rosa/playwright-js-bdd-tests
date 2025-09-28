const { remote } = require("webdriverio");
const path = require("path");
require("dotenv").config();

const DEFAULT_SYSTEM_PORT = 58200;
const dynamicSystemPort = (process.env.APPIUM_DEFAULT_SYSTEM_PORT ? parseInt(process.env.APPIUM_DEFAULT_SYSTEM_PORT) : DEFAULT_SYSTEM_PORT) + Math.floor(Math.random() * 20);

class AppiumDriverSetup {
  static async getAndroidDriver() {
    console.log(">>>> ANDROID APP PATH:", path.join(__dirname, process.env.ANDROID_RELATIVE_APP_PATH));

    const androidCaps = {
      platformName: "Android",
      "appium:platformVersion": process.env.ANDROID_PLATFORM_VERSION || "16.0",
      "appium:deviceName": process.env.ANDROID_DEVICE || "Pixel_6",
      "appium:udid": process.env.ANDROID_APP_UDID || "25261FDF60045T",
      "appium:automationName": process.env.ANDROID_AUTOMATION_NAME || "UiAutomator2",
      "appium:app": path.join(__dirname, process.env.ANDROID_RELATIVE_APP_PATH),
      "appium:appPackage": process.env.ANDROID_APP_PACKAGE,
      "appium:appActivity": process.env.ANDROID_APP_ACTIVITY,
      "appium:noReset": false,
      "appium:fullReset": false,
      "appium:autoGrantPermissions": true,
      "appium:newCommandTimeout": parseInt(process.env.APPIUM_COMMAND_TIMEOUT || 3600),
      "appium:systemPort": dynamicSystemPort
    };

    console.log("⚡ Launching Android driver on systemPort:", dynamicSystemPort);
    return await AppiumDriverSetup.createDriver(androidCaps);
  }

  static async getIOSDriver() {
    console.log(">>>> IOS APP PATH:", path.resolve(__dirname, process.env.IOS_RELATIVE_APP_PATH));

    const iosCaps = {
      platformName: "iOS",
      "appium:platformVersion": process.env.IOS_PLATFORM_VERSION || "18.0",
      "appium:deviceName": process.env.IOS_DEVICE || "iPhone XS",
      "appium:udid": process.env.IOS_APP_UDID || "00008020-00050C3A2121002E",
      "appium:automationName": process.env.IOS_AUTOMATION_NAME || "XCUITest",
      "appium:app": path.resolve(__dirname, process.env.IOS_RELATIVE_APP_PATH),
      "appium:bundleId": process.env.IOS_BUNDLE_ID,
      "appium:noReset": false,
      "appium:fullReset": true,
      "appium:newCommandTimeout": parseInt(process.env.APPIUM_COMMAND_TIMEOUT || 3600)
    };

    console.log("⚡ Launching iOS driver on systemPort:", dynamicSystemPort);
    return await AppiumDriverSetup.createDriver(iosCaps);
  }

  static async createDriver(caps) {
    return await remote({
      protocol: process.env.APPIUM_PROTOCOL || "http",
      hostname: process.env.APPIUM_HOSTNAME || "127.0.0.1", // where Appium server is running
      port: parseInt(process.env.APPIUM_SERVER_PORT || 4723),
      path: process.env.APPIUM_SERVER_PATH || "/",
      capabilities: caps
    });
  }
}

module.exports = AppiumDriverSetup;
