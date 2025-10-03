// support/world.js

const { setWorldConstructor, Before, After } = require("@cucumber/cucumber");
const { Status } = require("@cucumber/cucumber");
const { request } = require("@playwright/test");
const BrowserHandler = require("./browserHandler");
const AppiumDriverSetup = require("./appiumDriverSetup");
const { attachScreenshotOfWebPageFailure, attachScreenshotOfMobileScreenFailure } = require("../support/utils/screenshotHelper.js");
let tags;

class CustomWorld {
  constructor(options) {
    this.browserHandler = new BrowserHandler();
    this.attach = options.attach;
    this.apiContext = null;
    this.response = null;
    this.androidDriver = null;
  }

  async initApiContext() {
    this.apiContext = await request.newContext({
      baseURL: process.env.BASE_API
    });
  }

  async disposeApi() {
    await this.apiContext.dispose();
  }

  async initBrowser() {
    const isHeadless = process.env.HEADLESS == "true";
    const browserType = process.env.BROWSER || "chromium";
    this.browser = await this.browserHandler.launch(browserType, isHeadless);
    this.browserName = browserType;
  }

  getPage() {
    return this.browserHandler.getPage();
  }

  async closeBrowser() {
    if (this.browserHandler?.browser) {
      try {
        await this.browserHandler.close();
      } catch (err) {
        console.warn("Browser already closed or error on close:", err.message);
      }
    }
  }

  async initAndroid() {
    this.androidDriver = await AppiumDriverSetup.getAndroidDriver();
  }

  async quitAndroid() {
    if (this.androidDriver) {
      await this.androidDriver.deleteSession();
      this.androidDriver = null;
    }
  }

  async initIOS() {
    this.iosDriver = await AppiumDriverSetup.getIOSDriver();
    return this.iosDriver;
  }

  async quitIOS() {
    if (this.iosDriver) {
      await this.iosDriver.deleteSession();
      this.iosDriver = null;
    }
  }
}

setWorldConstructor(CustomWorld);

// The hooks

Before(async function (scenario) {
  tags = scenario.pickle.tags.map((t) => t.name);
  console.log(`--> Scenario - "${scenario.pickle.name}" with tags: ${tags.join(", ")}`);

  await this.initApiContext();
  this.page = this.getPage();

  switch (process.env.TEST_LEVEL) {
    case "web":
      await this.initBrowser();
      this.page = this.getPage();
      break;
    case "android":
      await this.initAndroid();
      break;
    case "ios":
      await this.initIOS();
      break;
    default:
      await this.initBrowser();
      break;
  }
});

process.on("uncaughtException", (err) => {
  if (err.code === "ERR_IPC_CHANNEL_CLOSED") return;
  console.error(err);
});

After(async function (scenario) {
  const status = scenario.result?.status == Status.PASSED ? "PASSED 🟢" : "FAILED 🔴";
  const isFailed = scenario.result?.status === Status.FAILED;
  const page = this.getPage?.();

  console.log(`--> ${status} Scenario: "${scenario.pickle.name}"`);

  try {
    switch (process.env.TEST_LEVEL) {
      case "web":
        if (isFailed && page && !page.isClosed?.() && this.attach) {
          console.log(`--> BROWSER: ${this.browserName}`);
          await attachScreenshotOfWebPageFailure(this, scenario, page);
        }
        await this.closeBrowser();
        break;
      case "android":
        if (isFailed && this.androidDriver) {
          await attachScreenshotOfMobileScreenFailure(this, scenario, this.androidDriver, "android");
        }
        await this.quitAndroid();
        break;
      case "ios":
        if (isFailed && this.iosDriver) {
          await attachScreenshotOfMobileScreenFailure(this, scenario, this.iosDriver, "ios");
        }
        await this.quitIOS();
        break;
      default:
        await this.closeBrowser();
        break;
    }
    await this.disposeApi();
  } catch (err) {
    console.warn("⚠️ After hook - unhandled error ignored:", err.message);
  }
});
