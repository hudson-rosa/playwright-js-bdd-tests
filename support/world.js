// support/world.js

const { setWorldConstructor, Before, After } = require("@cucumber/cucumber");
const { Status } = require("@cucumber/cucumber");
const { request } = require("@playwright/test");
const BrowserHandler = require("./web/browser-handler.js");
const AppiumDriverSetup = require("./mobile/appium-driver-setup.js");
const { attachScreenshotOfWebPageFailure, attachScreenshotOfMobileScreenFailure } = require("./utils/screenshot-helper.js");
const { testStatus } = require("./utils/strings-helper.js");
let tags;

class CustomWorld {
  constructor(options) {
    this.browserHandler = new BrowserHandler();
    this.attach = options.attach;
    this.apiContext = null;
    this.response = null;
    this.soapBody = null;
    this.soapRequest = null;
    this.androidDriver = null;
  }

  async initRestApiContext() {
    this.apiContext = await request.newContext({
      baseURL: process.env.RESTAPI_BASE_URL
    });
    const restResp = await this.apiContext.get(process.env.RESTAPI_BASE_URL);
    console.log("🚀 Initialized REST API context with base URL:", restResp.url());
  }
  async initSoapApiContext() {
    this.apiContext = await request.newContext({
      baseURL: process.env.SOAPAPI_BASE_URL
    });
    const soapResp = await this.apiContext.get(process.env.SOAPAPI_BASE_URL);
    console.log("🚀 Initialized SOAP API context with base URL:", soapResp.url());
  }

  async disposeApi() {
    await this.apiContext.dispose();
  }

  async initBrowser() {
    const isHeadless = process.env.HEADLESS == "true";
    const browserType = process.env.BROWSER || "chromium";
    this.browser = await this.browserHandler.launch(browserType, isHeadless);
    this.browserName = browserType;
    console.log(`🚀 Initialized ${this.browserName} Browser 🚀`);
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
    console.log("🚀 Initialized Android Driver 🚀");
  }

  async quitAndroid() {
    if (this.androidDriver) {
      await this.androidDriver.deleteSession();
      this.androidDriver = null;
    }
  }

  async initIOS() {
    this.iosDriver = await AppiumDriverSetup.getIOSDriver();
    console.log("🚀 Initialized iOS Driver 🚀");
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
    case "restapi":
      await this.initRestApiContext();
      break;
    case "soapapi":
      await this.initSoapApiContext();
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
  const status = testStatus(scenario);
  const isFailed = scenario.result?.status === Status.FAILED;
  const page = this.getPage?.();

  console.log(`\n--> ${status} Scenario: "${scenario.pickle.name}"\n`);

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
        break;
    }
    await this.disposeApi();

    if (this.soapRequest && this.attach) {
      this.attach(this.soapRequest, "text/xml");
    }

    if (this.response && this.attach) {
      const responseText = await this.response.text();
      this.attach(responseText, "text/xml");
    }
  } catch (err) {
    console.warn("⚠️ After hook - unhandled error ignored:", err.message);
  }
});
