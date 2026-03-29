// steps/api/soap/user-soap.steps.js

const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

const { sendSoapRequest } = require("../../../support/api/soap/soap-client");
const { parseSoapResponse } = require("../../../support/api/soap/soap-parser");
const { getOorsprongWS } = require("../../../support/api/soap/actions/actions-mapper");

Given("I have the ready envelope {string}", function (path) {
  this.envelopePath = `envelopes/${path}`;
  this.respBody = null;
});

When(
  "I send a SOAP request with action {string} and variables:",
  async function (actionName, dataTable) {
    const variables = dataTable.rowsHash();
    const actionPath = `${getOorsprongWS().namespaceUrl}${getOorsprongWS().actions[actionName]}`;

    await sendSoapRequest(this, this.envelopePath, variables, actionPath);
    this.respBody = await parseSoapResponse(this);
  }
);

Then("the SOAP response status should be {int}", function (status) {
  expect(this.response.status()).toBe(status);
});

Then("the SOAP node {string} should be {string}", function (nodeResult, expectedCapital) {
  const resultPath = getOorsprongWS().respNode[nodeResult];
  const value = resultPath.split(".").reduce((obj, key) => obj?.[key], this.respBody);

  expect(value).toBeDefined();
  expect(value.trim().toLowerCase()).toBe(expectedCapital.toLowerCase());
});