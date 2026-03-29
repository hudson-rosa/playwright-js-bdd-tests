// steps/api/soap/user-soap.steps.js

const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

const { sendSoapRequest } = require("../../../support/api/soap/soap-client");
const { parseSoapResponse } = require("../../../support/api/soap/soap-parser");

Given("I have the ready envelope {string}", function (path) {
  this.envelopePath = `envelopes/${path}`;
  this.respBody = null;
});

When(
  "I send a SOAP request with action {string} and variables:",
  async function (action, dataTable) {
    const variables = dataTable.rowsHash();

    await sendSoapRequest(this, this.envelopePath, variables, action);
    this.respBody = await parseSoapResponse(this);
  }
);

Then("the SOAP response status should be {int}", function (status) {
  expect(this.response.status()).toBe(status);
});

Then("the SOAP node {string} should be {string}", function (path, expected) {
  const value = path.split(".").reduce((obj, key) => obj?.[key], this.respBody);

  expect(value).toBeDefined();
  expect(value.trim().toLowerCase()).toBe(expected.toLowerCase());
});