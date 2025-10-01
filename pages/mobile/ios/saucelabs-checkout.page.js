// pages/mobile/ios/saucelabs-checkout.page.js

class SLCheckoutPaymentPage {
  constructor(driver) {
    this.driver = driver;
  }

  // Selectors
  get REVIEW_ORDER_BUTTON() {
    return "~review-order-btn";
  }
  get BILLING_ADDRESS_CHECKBOX() {
    return "~billing-checkbox";
  }

  // Card fields
  get FULL_NAME_FIELD() {
    return "~card-fullname";
  }
  get CARD_NUMBER_FIELD() {
    return "~card-number";
  }
  get EXPIRATION_DATE_FIELD() {
    return "~card-expiration";
  }
  get SECURITY_CODE_FIELD() {
    return "~card-security";
  }

  // Billing fields
  get BILLING_FULL_NAME_FIELD() {
    return "~billing-fullname";
  }
  get ADDRESS_LINE_ONE_FIELD() {
    return "~billing-address1";
  }
  get ADDRESS_LINE_TWO_FIELD() {
    return "~billing-address2";
  }
  get CITY_FIELD() {
    return "~billing-city";
  }
  get STATE_REGION_FIELD() {
    return "~billing-state";
  }
  get ZIP_CODE_FIELD() {
    return "~billing-zip";
  }
  get COUNTRY_FIELD() {
    return "~billing-country";
  }

  async waitForIsShown() {
    await this.driver.$(this.REVIEW_ORDER_BUTTON).waitForDisplayed();
  }

  async tapOnReviewOrderButton() {
    await this.driver.$(this.REVIEW_ORDER_BUTTON).click();
  }

  async tapOnBillingAddressCheckbox() {
    await this.driver.$(this.BILLING_ADDRESS_CHECKBOX).click();
  }

  async fillCardData(data) {
    if (data.fullName) await this.driver.$(this.FULL_NAME_FIELD).setValue(data.fullName);
    if (data.cardNumber) await this.driver.$(this.CARD_NUMBER_FIELD).setValue(data.cardNumber);
    if (data.expirationDate) await this.driver.$(this.EXPIRATION_DATE_FIELD).setValue(data.expirationDate);
    if (data.securityCode) await this.driver.$(this.SECURITY_CODE_FIELD).setValue(data.securityCode);
  }

  async fillBillingData(data) {
    if (data.fullName) await this.driver.$(this.BILLING_FULL_NAME_FIELD).setValue(data.fullName);
    if (data.addressLineOne) await this.driver.$(this.ADDRESS_LINE_ONE_FIELD).setValue(data.addressLineOne);
    if (data.addressLineTwo) await this.driver.$(this.ADDRESS_LINE_TWO_FIELD).setValue(data.addressLineTwo);
    if (data.city) await this.driver.$(this.CITY_FIELD).setValue(data.city);
    if (data.stateRegion) await this.driver.$(this.STATE_REGION_FIELD).setValue(data.stateRegion);
    if (data.zipCode) await this.driver.$(this.ZIP_CODE_FIELD).setValue(data.zipCode);
    if (data.country) await this.driver.$(this.COUNTRY_FIELD).setValue(data.country);
  }

  async getErrorMessage(field) {
    const selector = `~error-${field}`;
    return await this.driver.$(selector).getText();
  }
}

module.exports = SLCheckoutPaymentPage;