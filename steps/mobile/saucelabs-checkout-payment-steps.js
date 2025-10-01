const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { SLCheckoutPaymentPage, SLCheckoutReviewOrderPage } = require("../../pages/page_modules/ios_index");

let checkoutPaymentPage;
let reviewOrderPage;

Given("the app is restarted", async function () {
  await restartApp();
});

Given("I navigate to the checkout payment page", async function () {
  this.iosDriver = await this.initIOS();
  checkoutPaymentPage = new SLCheckoutPaymentPage(this.iosDriver);
  reviewOrderPage = new SLCheckoutReviewOrderPage(this.iosDriver);

  await openDeepLinkUrl("checkout-payment");
  await checkoutPaymentPage.waitForIsShown();
});

When("I tap the review order button", async function () {
  await checkoutPaymentPage.tapOnReviewOrderButton();
});

When("I enable the billing address form", async function () {
  await checkoutPaymentPage.tapOnBillingAddressCheckbox();
});

When("I fill in card data with:", async function (dataTable) {
  const data = dataTable.rowsHash();
  await checkoutPaymentPage.fillCardData(data);
});

When("I fill in billing data with:", async function (dataTable) {
  const data = dataTable.rowsHash();
  await checkoutPaymentPage.fillBillingData(data);
});

Then("I should see the following card error messages:", async function (dataTable) {
  for (const row of dataTable.rows()) {
    const [field, expectedMessage] = row;
    const message = await checkoutPaymentPage.getErrorMessage(field);
    expect(message).toBe(expectedMessage);
  }
});

Then("I should see the following billing error messages:", async function (dataTable) {
  for (const row of dataTable.rows()) {
    const [field, expectedMessage] = row;
    const message = await checkoutPaymentPage.getErrorMessage(field);
    expect(message).toBe(expectedMessage);
  }
});

Then("the review order page should be displayed", async function () {
  await reviewOrderPage.waitForIsShown();
});
