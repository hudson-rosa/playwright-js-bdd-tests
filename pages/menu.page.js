const { expect } = require("@playwright/test");

class MenuPage {
  constructor(page) {
    this.page = page;
    this.menu = {
      search: { label: "Search" },
      admin: { label: "Admin" },
      pim: { label: "PIM" },
      leave: { label: "Leave" },
      time: { label: "Time" },
      recruitment: { label: "Recruitment" },
      myinfo: { label: "My Info" },
      performance: { label: "Performance" },
      dashboard: { label: "Dashboard" },
      directory: { label: "Directory" },
      maintenance: { label: "Maintenance" },
      claim: { label: "Claim" },
      buzz: { label: "Buzz" }
    };
  }

  async openMenu(option) {
    const menuLevel = option.toString().toLowerCase().split(">")[0].trim();
    await this.page.getByRole("link", { name: this.menu[menuLevel]["label"] }).click();
  }
}

module.exports = MenuPage;
