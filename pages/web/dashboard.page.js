// pages/web/dashboard.page.js

const { expect } = require("@playwright/test");

class DashboardPage {
  constructor(page) {
    this.page = page;
    this.userDropdown = ".oxd-userdropdown-name";
    this.errorMessage = ".oxd-alert-content";
  }

  async assertDashboardHeader() {
    await expect(this.page).toHaveURL(/dashboard/);
    await this.page.waitForSelector(this.userDropdown, { state: "visible" });
    const userDropdown = await this.page.$(this.userDropdown);
    expect(userDropdown).toBeTruthy();
  }

  async verifyInvalidLoginMessage(expectedMessage) {
    const errorMessage = await this.page.textContent(this.errorMessage);
    expect(errorMessage).toContain(expectedMessage);
  }
}

module.exports = DashboardPage;
