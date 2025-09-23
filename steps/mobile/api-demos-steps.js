const { Given, When, Then, Before } = require("@cucumber/cucumber");
const { ADMainPage, ADAccessibilityPage } = require("../../pages/page_modules/android_index");
const assert = require("assert");
require("dotenv").config();

Given("the Android app is launched", async function() {
  this.apiDemosMainPage = new ADMainPage(this.androidDriver);
});

Given("I am on the API Demos main page", async function() {
  const isVisible = await this.apiDemosMainPage.isMainPageVisible();
  assert.strictEqual(isVisible, true, "Main page is not visible");
});

When("I navigate to the {string} section", async function(section) {
  await this.apiDemosMainPage.navigateToSection(section);
});

When("I open {string}", async function(subItem) {
  await this.apiDemosMainPage.openSubItem(subItem);
});

Then("the Accessibility Node Provider page should be displayed", async function() {
  this.apiDemosAccessibilityPage = new ADAccessibilityPage(this.androidDriver);
  const visible = await this.apiDemosAccessibilityPage.verifyNodeProviderDisplayed();
  assert.strictEqual(visible, true, "Node Provider page not visible");
});

Then("the Bouncing Balls animation should be displayed", async function() {
  const activity = await this.androidDriver.getCurrentActivity();
  assert.ok(activity.includes("graphics/BouncingBalls"), "Wrong activity launched");
});

Then("I should see the {string} option", async function(option) {
  const visible = await this.apiDemosMainPage.isDisplayed(option);
  assert.strictEqual(visible, true, `${option} option not visible`);
});
