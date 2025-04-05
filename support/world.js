// support/world.js
const { setWorldConstructor } = require("@cucumber/cucumber");
const BrowserHandler = require("./browserHandler");

class CustomWorld {
  constructor() {
    this.browserHandler = new BrowserHandler();
  }

  async initBrowser() {
    const browserType = process.env.BROWSER || "chromium";
    await this.browserHandler.launch(browserType, false); // false = headless disabled
  }

  getPage() {
    return this.browserHandler.getPage();
  }

  async closeBrowser() {
    await this.browserHandler.close();
  }
}

setWorldConstructor(CustomWorld);
