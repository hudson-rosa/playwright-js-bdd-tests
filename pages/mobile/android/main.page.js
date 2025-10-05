// pages/mobile/android/main.page.js

const { removeQuotes } = require("../../../support/utils/strings-helper.js");

class ADMainPage {
  constructor(driver) {
    this.driver = driver;
    this.ACCESSIBILITY_MENU_ITEM = "~Accessibility";
  }

  async isMainPageVisible() {
    try {
      const el = await this.driver.$(this.ACCESSIBILITY_MENU_ITEM);
      return await el.isDisplayed();
    } catch (err) {
      return false;
    }
  }

  async navigateToSection(section) {
    const el = await this.driver.$(`~${removeQuotes(section)}`);
    await el.click();
    return this;
  }

  async openSubItem(subItem) {
    const el = await this.driver.$(`~${removeQuotes(subItem)}`);
    await el.click();
    return this;
  }

  async isDisplayed(option) {
    const el = await this.driver.$(`~${removeQuotes(option)}`);
    return await el.isDisplayed();
  }
}

module.exports = ADMainPage;
