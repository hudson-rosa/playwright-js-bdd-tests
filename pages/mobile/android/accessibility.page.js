class ADAccessibilityPage {
  constructor(driver) {
    this.driver = driver;
    this.accessibilityNodeProvider = "~Accessibility Node Provider";
  }

  async verifyNodeProviderDisplayed() {
    const el = await this.driver.$(this.accessibilityNodeProvider);
    return await el.isDisplayed();
  }
}

module.exports = ADAccessibilityPage;
