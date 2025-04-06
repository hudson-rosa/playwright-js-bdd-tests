// support/world.js
const { setWorldConstructor } = require("@cucumber/cucumber");
const BrowserHandler = require("./browserHandler");

class CustomWorld {
  constructor() {
    this.browserHandler = new BrowserHandler();
  }

  async initBrowser() {
    const isHeadless = process.env.HEADLESS == "true";
    const browserType = process.env.BROWSER || "chromium";
    await this.browserHandler.launch(browserType, isHeadless); // false = headless disabled
  }

  getPage() {
    return this.browserHandler.getPage();
  }

  async closeBrowser() {
    try {
      await this.browserHandler.close();
    } catch (err) {
      console.error("After hook error:", err);
    }
  }
}

setWorldConstructor(CustomWorld);
