class ADMainPage {
  constructor(driver) {
    this.driver = driver;
    this.ACCESSIBILITY_OPTIONAL = "~Accessibility";
  }

  async isMainPageVisible() {
    try {
      const el = await this.driver.$(this.ACCESSIBILITY_OPTIONAL);
      return await el.isDisplayed();
    } catch (err) {
      return false;
    }
  }

  async navigateToSection(section) {
    const el = await this.driver.$(`~${section}`);
    await el.click();
  }

  async openSubItem(subItem) {
    const el = await this.driver.$(`~${subItem}`);
    await el.click();
  }

  async isDisplayed(option) {
    const el = await this.driver.$(`~${option}`);
    return await el.isDisplayed();
  }
}

module.exports = ADMainPage;
