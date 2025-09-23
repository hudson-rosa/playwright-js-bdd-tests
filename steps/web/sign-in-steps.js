const { Given, When, Then, Before } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
require("dotenv").config();

const { SignInPage, DashboardPage } = require("../../pages/page_modules/web_index");

let signInPage;
let dashboardPage;

Given("I am on OrangeHRM website at Sign In page", async function() {
  signInPage = new SignInPage(this.getPage());
  dashboardPage = new DashboardPage(this.getPage());
  await signInPage.openPage();
});

When("I sign in using valid account credentials", async function(dataTable) {
  const credentials = dataTable.rowsHash();
  await signInPage.fillUsername(credentials.user);
  await signInPage.fillPassword(credentials.password);
  await signInPage.submitLogin();
});

Then("my session loads at the Dashboard page", async function() {
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
