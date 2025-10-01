
// pages/mobile/ios/testapp.page.js

class IOSTestAppPage {
  constructor(driver) {
    this.driver = driver;
    this.TEXT_FIELD = "~TextField1";
    this.COMPUTE_SUM_BUTTON = "~ComputeSumButton";
    this.ANSWER_LABEL = "~Answer";
    this.SHOW_ALERT_BUTTON = "~ShowAlert";
    this.OK_BUTTON = "~OK";
  }

  async enterText(text) {
    const el = await this.findElement(this.TEXT_FIELD);
    await el.setValue(text);
  }

  async computeSum() {
    const el = await this.findElement(this.COMPUTE_SUM_BUTTON);
    await el.click();
  }

  async getAnswerText() {
    const el = await this.findElement(this.ANSWER_LABEL);
    return el.getText();
  }

  async triggerAlert() {
    const el = await this.findElement(this.SHOW_ALERT_BUTTON);
    await el.click();
  }

  async dismissAlert() {
    const el = await this.findElement(this.OK_BUTTON);
    await el.click();
  }
}

module.exports = IOSTestAppPage;
