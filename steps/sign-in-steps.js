const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { chromium } = require("playwright");
require("dotenv").config();

const { SignInPage, DashboardPage } = require("../pages/page_modules/index");

let signInPage;
let dashboardPage;
let browser;
let page;

Before(async function() {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  signInPage = new SignInPage(page);
  dashboardPage = new DashboardPage(page);
});

Given("I am on OrangeHRM website at Sign In page", async function() {
  await signInPage.openPage();
});

When("I sign in using valid account credentials", async function(dataTable) {
  const credentials = dataTable.rowsHash();
  await signInPage.fillUsername(credentials.user);
  await signInPage.fillPassword(credentials.password);
  await signInPage.submitLogin();
});

Then("my session loads at the Dashboard page", async function() {
  dashboardPage = new DashboardPage(page);
  await dashboardPage.assertDashboardHeader();
});

When("I sign in using invalid account credentials", async function() {
  await signInPage.fillUsername("invalidUser");
  await signInPage.fillPassword("wrongPass");
  await signInPage.submitLogin();
});

Then("the message {string} is displayed", async function(expectedMessage) {
  await dashboardPage.verifyInvalidLoginMessage(expectedMessage);
});

After(async function() {
  if (browser) {
    await browser.close();
  }
});
