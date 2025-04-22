const { Given, When, Then, Before } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { SignInPage, DashboardPage, MenuPage } = require("../pages/page_modules/index");
const { attachScreenshot } = require("../support/utils/screenshotHelper.js");
require("dotenv").config();

let signInPage;
let dashboardPage;
let menuPage;

Before(async function() {
  await this.initBrowser();
  signInPage = new SignInPage(this.getPage());
  dashboardPage = new DashboardPage(this.getPage());
  menuPage = new MenuPage(this.getPage());
});

Given(/^I am on "(.*)" page as the user:$/, async function (navigation, dataTable) {
  const credentials = dataTable.rowsHash();

  await signInPage.openPage();
  await signInPage.fillUsername(credentials.user);
  await signInPage.fillPassword(credentials.password);
  await signInPage.submitLogin();

  await menuPage.openMenu(navigation);
  await attachScreenshot(this, navigation);
});

When("I tap {string} to register a new vacancy", function(string) {
  // Write code here that turns the phrase above into concrete actions
  return "to-do";
});

When("I save the form with with all the required entries", function(dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return "to-do";
});

Then("I see the new register added to the vacancies' list", function() {
  // Write code here that turns the phrase above into concrete actions
  return "to-do";
});
