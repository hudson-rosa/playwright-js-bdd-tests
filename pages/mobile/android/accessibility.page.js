class ADAccessibilityPage {
  constructor(driver) {
    this.driver = driver;
    this.ACCESSIBILITY_NODE_PROVIDER = "~Accessibility Node Provider";
  }

  async verifyNodeProviderDisplayed() {
    const el = await this.driver.$(this.ACCESSIBILITY_NODE_PROVIDER);
    return await el.isDisplayed();
  }
}

module.exports = ADAccessibilityPage;
