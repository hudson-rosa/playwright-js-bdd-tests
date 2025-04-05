const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
require("dotenv").config();


Before(async function() {
  await this.initBrowser();
});

Given("I am on {string} page", function(string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("I tap {string} to register a new vacancy", function(string) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

When("I save the form with with all the required entries", function(dataTable) {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

Then("I see the new register added to the vacancies' list", function() {
  // Write code here that turns the phrase above into concrete actions
  return "pending";
});

After(async function() {
  await this.closeBrowser();
});
