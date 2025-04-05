// support/browserHandler.js
const { chromium, firefox, webkit } = require("playwright");

const browsers = { chromium, firefox, webkit };

class BrowserHandler {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async launch(browserType = "chromium", headless = true) {
    const type = browsers[browserType];
    if (!type) throw new Error(`Unsupported browser: ${browserType}`);

    this.browser = await type.launch({ headless });
    this.page = await this.browser.newPage();
  }

  getPage() {
    return this.page;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

module.exports = BrowserHandler;
