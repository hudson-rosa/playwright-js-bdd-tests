// pages/web/navigation.page.js

class NavigationPage {
  constructor(page) {
    this.page = page;
    this.menu = {
      admin: { label: "Admin", url: `${process.env.WEB_BASE_URL}/web/index.php/admin/viewSystemUsers` },
      pim: { label: "PIM", url: `${process.env.WEB_BASE_URL}/web/index.php/pim/viewEmployeeList` },
      leave: { label: "Leave", url: `${process.env.WEB_BASE_URL}/web/index.php/leave/viewLeaveList` },
      time: { label: "Time", url: `${process.env.WEB_BASE_URL}/web/index.php/time/viewEmployeeTimesheet` },
      recruitment: { label: "Recruitment", url: `${process.env.WEB_BASE_URL}/web/index.php/recruitment/viewCandidates` },
      myinfo: { label: "My Info", url: `${process.env.WEB_BASE_URL}/web/index.php/pim/viewPersonalDetails/empNumber/7` },
      performance: { label: "Performance", url: `${process.env.WEB_BASE_URL}/web/index.php/performance/searchEvaluatePerformanceReview` },
      dashboard: { label: "Dashboard", url: `${process.env.WEB_BASE_URL}/web/index.php/dashboard/index` },
      directory: { label: "Directory", url: `${process.env.WEB_BASE_URL}/web/index.php/directory/viewDirectory` },
      maintenance: { label: "Maintenance", url: `${process.env.WEB_BASE_URL}/web/index.php/maintenance/purgeEmployee` },
      claim: { label: "Claim", url: `${process.env.WEB_BASE_URL}/web/index.php/claim/viewAssignClaim` },
      buzz: { label: "Buzz", url: `${process.env.WEB_BASE_URL}/web/index.php/buzz/viewBuzz` }
    };
  }

  getMenuInfo(breadcrumb, level) {
    if (level == 0) {
      breadcrumb = breadcrumb.toLowerCase();
    }
    return breadcrumb.toString().split(">")[Number(level)].trim();
  }

  async clickOnMenuItem(breadcrumb) {
    const menuLevel = this.getMenuInfo(breadcrumb, 0);
    await this.page.getByRole("link", { name: this.menu[menuLevel]["label"] }).click();
  }

  async openFromUrl(breadcrumb, level) {
    const menuLevel = this.getMenuInfo(breadcrumb, level);
    await this.page.goto(this.menu[menuLevel]["url"]);
    return this.page;
  }

  async openTab(breadcrumb, level) {
    const tabName = this.getMenuInfo(breadcrumb, level);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector(`//a[contains(text(),'${tabName}')]`, { state: "visible" });
    await this.page.click(`//a[contains(text(),'${tabName}')]`);
    return this.page;
  }
}

module.exports = NavigationPage;
