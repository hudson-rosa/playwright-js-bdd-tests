// support/world.js
const { setWorldConstructor, Before, After } = require("@cucumber/cucumber");
const BrowserHandler = require("./browserHandler");

const fs = require("fs");
const path = require("path");
const sanitizeFilename = require("sanitize-filename");
const { Status } = require("@cucumber/cucumber");

class CustomWorld {
  constructor(options) {
    this.browserHandler = new BrowserHandler();
    this.attach = options.attach;
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
}

setWorldConstructor(CustomWorld);

Before(async function() {
  await this.initBrowser();
  const page = this.getPage();
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
});