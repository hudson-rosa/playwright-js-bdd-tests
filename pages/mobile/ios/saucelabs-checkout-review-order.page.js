// pages/mobile/ios/saucelabs-checkout-review-order.page.js

class SLCheckoutReviewOrderPage {
  constructor(driver) {
    this.driver = driver;
  }

  get REVIEW_ORDER_HEADER() { return '~review-order-header'; }

  async waitForIsShown() {
    await this.driver.$(this.REVIEW_ORDER_HEADER).waitForDisplayed();
  }
}

module.exports = SLCheckoutReviewOrderPage;