// support/world.js
const { setWorldConstructor, Before, After } = require("@cucumber/cucumber");
const { Status } = require("@cucumber/cucumber");
const { request } = require("@playwright/test");
const BrowserHandler = require("./browserHandler");
const AppiumDriverSetup = require("./appiumDriverSetup");
const { attachScreenshotFromFailure } = require("../support/utils/screenshotHelper.js");
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
  await this.initBrowser();
  this.page = this.getPage();

  if (tags.includes("@android")) {
    await this.initAndroid();
  }

  if (tags.includes("@ios")) {
    await this.initIOS();
  }
});

After(async function (scenario) {
  console.log(`--> Scenario - "${scenario.pickle.name}" has been ${scenario.result?.status}!`);
  console.log(`--> BROWSER: ${this.browserName}`);
  const page = this.getPage();
  const isFailed = scenario.result?.status === Status.FAILED;

  if (tags.includes("@web") && isFailed && page != null) {
    await attachScreenshotFromFailure(this, scenario, page);
  }

  await this.closeBrowser();
  await this.disposeApi();

  if (tags.includes("@android")) {
    await this.quitAndroid();
  }

  if (tags.includes("@ios")) {
    await this.quitIOS();
  }
});
