// support/world.js

const { setWorldConstructor, Before, After } = require("@cucumber/cucumber");
const { Status } = require("@cucumber/cucumber");
const { request } = require("@playwright/test");
const BrowserHandler = require("./browserHandler");
const AppiumDriverSetup = require("./appiumDriverSetup");
const { attachScreenshotFromBrowserFailure } = require("../support/utils/screenshotHelper.js");
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
    try {
      await this.browserHandler.close();
    } catch (err) {
      console.error("Error when closing the browser: ", err);
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

  if (this.allure) {
    this.allure.addParameter("Browser", process.env.BROWSER || "unknown");
  }

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

After(async function (scenario) {
  console.log(`--> Scenario - "${scenario.pickle.name}" has been ${scenario.result?.status}!`);
  const page = this.getPage();
  const isFailed = scenario.result?.status === Status.FAILED;

  switch (process.env.TEST_LEVEL) {
    case "web":
      if (isFailed && page != null) {
        console.log(`--> BROWSER: ${this.browserName}`);
        await attachScreenshotFromBrowserFailure(this, scenario, page);
      }
      await this.closeBrowser();
      break;
    case "android":
      await this.quitAndroid();
      break;
    case "ios":
      await this.quitIOS();
      break;
    default:
      await this.closeBrowser();
      break;
  }

  await this.disposeApi();
});
