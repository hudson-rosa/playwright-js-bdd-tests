// support/world.js
const { setWorldConstructor, Before, After } = require("@cucumber/cucumber");
const { Status } = require("@cucumber/cucumber");
const { request } = require('@playwright/test');
const BrowserHandler = require("./browserHandler");
const AppiumDriverSetup = require("./appiumDriverSetup");

const fs = require("fs");
const path = require("path");
const sanitizeFilename = require("sanitize-filename");
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
    await this.browserHandler.launch(browserType, isHeadless);
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

}

setWorldConstructor(CustomWorld);

Before(async function (scenario) {
  tags = scenario.pickle.tags.map(t => t.name);
  console.log(`--> Scenario - "${scenario.pickle.name}" with tags: ${tags.join(", ")}`);
  
  await this.initApiContext();
  await this.initBrowser();
  this.page = this.getPage();

  if (tags.includes("@android")) {
    await this.initAndroid();
  }
});

After(async function (scenario) {
  const page = this.getPage();
  console.log(`--> Scenario - "${scenario.pickle.name}" has been ${scenario.result?.status}!`);
  const isFailed = scenario.result?.status === Status.FAILED;
  
  if (isFailed && page != null) {
    const screenshotsDir = path.resolve(__dirname, "../allure-results");
    console.log('--> Capturing screenshot...' + screenshotsDir);

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const scenarioName = sanitizeFilename(scenario.pickle.name);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${timestamp}_${scenarioName}.png`;
    const filePath = path.join(screenshotsDir, fileName);

    const screenshotBuffer = await page.screenshot({ path: filePath, type: "png" });

    console.log(`📸 Attaching screenshot at: ${filePath}`);
    this.attach(screenshotBuffer, "image/png");
  }

  await this.closeBrowser();
  await this.disposeApi();

  if (tags.includes("@android")) { 
    await this.quitAndroid();
  }
});