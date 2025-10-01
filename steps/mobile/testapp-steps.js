// steps/mobile/testapp-steps.js

const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const IOSTestAppPage = require("../../pages/page_modules/ios_index");

let iosAppPage;

Given("the iOS app is launched", async function () {
  this.iosDriver = await this.initIOS();
  iosAppPage = new IOSTestAppPage(this.iosDriver);
});

When("I enter {string} in the text field", async function (text) {
  await iosAppPage.enterText(text);
});

When("I compute the sum", async function () {
  await iosAppPage.computeSum();
});

Then("the result should be {string}", async function (expected) {
  const result = await iosAppPage.getAnswerText();
  expect(result).toBe(expected);
});

When("I trigger an alert", async function () {
  await iosAppPage.triggerAlert();
});

Then("the alert with title {string} should be visible", async function (title) {
  const pageSource = await this.iosDriver.getPageSource();
  expect(pageSource).toContain(title);
});

Then("the alert with title {string} should not be visible", async function (title) {
  const pageSource = await this.iosDriver.getPageSource();
  expect(pageSource).not.toContain(title);
});

Then("the text field should be visible", async function () {
  const visible = await iosAppPage.isDisplayed(iosAppPage.TEXT_FIELD);
  expect(visible).toBeTruthy();
});

Then("the compute sum button should be visible", async function () {
  const visible = await iosAppPage.isDisplayed(iosAppPage.COMPUTE_SUM_BUTTON);
  expect(visible).toBeTruthy();
});

Then("the show alert button should be visible", async function () {
  const visible = await iosAppPage.isDisplayed(iosAppPage.SHOW_ALERT_BUTTON);
  expect(visible).toBeTruthy();
});
