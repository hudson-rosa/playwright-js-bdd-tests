// steps/mobile/api-demos.steps.js

const { Given, When, Then } = require("@cucumber/cucumber");
const { ADMainPage, ADAccessibilityPage } = require("../../pages/page_modules/android-index");
const assert = require("assert");
require("dotenv").config();

Given("the Android app is launched", async function () {
  this.apiDemosMainPage = new ADMainPage(this.androidDriver);
});

Given("I am on the API Demos main page", async function () {
  const isVisible = await this.apiDemosMainPage.isMainPageVisible();
  const assertionFailureMessage = "Main page is not visible";
  assert.strictEqual(isVisible, true, assertionFailureMessage);
});

When(/^I navigate to the (.*) section$/, async function (section) {
  await this.apiDemosMainPage.navigateToSection(section);
});

When(/^I open (.*)$/, async function(subItem) {
  await this.apiDemosMainPage.openSubItem(subItem);
});

Then("the Accessibility Node Provider page should be displayed", async function() {
  this.apiDemosAccessibilityPage = new ADAccessibilityPage(this.androidDriver);
  const visible = await this.apiDemosAccessibilityPage.verifyNodeProviderDisplayed();
  const assertionFailureMessage = "Node Provider page not visible";
  assert.strictEqual(visible, true, assertionFailureMessage);
});

Then("the Bouncing Balls animation should be displayed", async function() {
  const activity = await this.androidDriver.getCurrentActivity();
  console.log("Current activity is: ", activity);
  const assertionFailureMessage = "Wrong activity launched";
  assert.ok(activity.includes(".animation.BouncingBalls"), assertionFailureMessage);
});

Then(/^I should see the (.*) option$/, async function(option) {
  const visibleOption = await this.apiDemosMainPage.isDisplayed(option);
  assert.strictEqual(visibleOption, true, `${option} option not visible`);
});
