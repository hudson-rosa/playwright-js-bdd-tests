// support/mobile/appium-driver-setup.js

const { remote } = require("webdriverio");
const path = require("path");
require("dotenv").config();

const DEFAULT_SYSTEM_PORT = 58200;
const dynamicSystemPort = (process.env.APPIUM_DEFAULT_SYSTEM_PORT ? parseInt(process.env.APPIUM_DEFAULT_SYSTEM_PORT) : DEFAULT_SYSTEM_PORT) + Math.floor(Math.random() * 20);

const androidDevices = {
  emulator_pixel_android15: {
    "appium:platformVersion": "15",
    "appium:deviceName": "Medium_Phone_API_35",
    "appium:udid": "emulator-5554",
  },
  real_pixel6_android16: {
    "appium:platformVersion": "16",
    "appium:deviceName": "Pixel_6",
    "appium:udid": "25261FDF60045T",
  },
  real_galaxyS22_android15: {
    "appium:platformVersion": "15",
    "appium:deviceName": "Galaxy_S22",
    "appium:udid": "",
  },
};

const iosDevices = {
  real_iphoneXS_ios187: {
    "appium:platformVersion": "18.7",
    "appium:deviceName": "iPhone XS",
    "appium:udid": "",
  },
  real_iphone15pro_ios26: {
    "appium:platformVersion": "26.0",
    "appium:deviceName": "iPhone 15 Pro",
    "appium:udid": "",
  },
};

class AppiumDriverSetup {

  /**
   * Get Android driver instance  
   * @return {Promise<WebdriverIO.Browser>} The Android driver instance
   */
  static async getAndroidDriver() {
    console.log(">>>> ANDROID APP PATH:", path.join(__dirname, process.env.ANDROID_RELATIVE_APP_PATH));
    
    const profileName = process.env.ANDROID_PROFILE || "pixel6_android16";
    const profile = androidDevices[profileName];

    if (!profile) {
      throw new Error(`❌ Unknown Android profile: ${profileName}`);
    }

    const androidCaps = {
      platformName: "Android",
      "appium:automationName": process.env.ANDROID_AUTOMATION_NAME || "UiAutomator2",
      "appium:app": path.join(__dirname, process.env.ANDROID_RELATIVE_APP_PATH),
      "appium:appPackage": process.env.ANDROID_APP_PACKAGE,
      "appium:appActivity": process.env.ANDROID_APP_ACTIVITY,
      "appium:noReset": process.env.NO_RESET,
      "appium:fullReset": process.env.FULL_RESET,
      "appium:autoGrantPermissions": process.env.APPIUM_AUTO_GRANT_PERMISSIONS,
      "appium:newCommandTimeout": parseInt(process.env.APPIUM_COMMAND_TIMEOUT || 3600),
      "appium:systemPort": dynamicSystemPort,
      ...profile
    };

    console.log("⚡ Launching Android driver on systemPort:", dynamicSystemPort);
    return await AppiumDriverSetup.createDriver(androidCaps);
  }

  /** Get iOS driver instance  
   * @return {Promise<WebdriverIO.Browser>} The iOS driver instance
   */
  static async getIOSDriver() {
    console.log(">>>> IOS APP PATH:", path.resolve(__dirname, process.env.IOS_RELATIVE_APP_PATH));

    const profileName = process.env.IOS_PROFILE || "iphoneXS_ios187";
    const profile = iosDevices[profileName];

    if (!profile) {
      throw new Error(`❌ Unknown iOS profile: ${profileName}`);
    }

    const iosCaps = {
      platformName: "iOS",
      "appium:automationName": process.env.IOS_AUTOMATION_NAME || "XCUITest",
      "appium:app": path.resolve(__dirname, process.env.IOS_RELATIVE_APP_PATH),
      "appium:bundleId": process.env.IOS_BUNDLE_ID,
      "appium:noReset": false,
      "appium:fullReset": true,
      "appium:newCommandTimeout": parseInt(process.env.APPIUM_COMMAND_TIMEOUT || 3600),
      ...profile
    };

    console.log("⚡ Launching iOS driver on systemPort:", dynamicSystemPort);
    return await AppiumDriverSetup.createDriver(iosCaps);
  }

  /** Create the driver with given capabilities
   * @param {object} caps - The desired capabilities for the driver
   * @return {Promise<WebdriverIO.Browser>} The driver instance
   */
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
