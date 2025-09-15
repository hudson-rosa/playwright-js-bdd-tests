const { Given, When, Then, Before } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
require("dotenv").config();

let response;

Given("I send a GET request to {string}", async function(endpoint) {
  response = await this.apiContext.get(`${process.env.BASE_API}${endpoint}`);
});

Given("I send a POST request to {string} with body:", async function(endpoint, docString) {
  response = await this.apiContext.post(`${process.env.BASE_API}${endpoint}`, {
    data: JSON.parse(docString)
  });
});

Then("the response status should be {int}", async function(statusCode) {
  expect(response.status()).toBe(statusCode);
});

Then("the response should contain {string}", async function(expectedText) {
  const body = await response.json();
  const bodyString = JSON.stringify(body);
  expect(bodyString).toContain(expectedText);
});
