// pages/web/recruitment-vacancies.page.js

const { expect } = require("@playwright/test");

class RecruitmentVacanciesPage {
  constructor(page) {
    this.page = page;
    this.addButton = "//button[normalize-space()='Add']";
    this.vacancyNameInput = this.page
      .locator("div")
      .filter({ hasText: /^Vacancy Name$/ })
      .getByRole("textbox");
    this.jobTitleDropdown = this.page.locator("form i");
    this.descriptionInput = this.page.getByRole("textbox", { name: "Type description here" });
    this.hiringManagerInput = this.page.getByRole("textbox", { name: "Type for hints..." });
  }
  
  async awaitForVacanciesPage() {
    await expect(this.page).toHaveURL(/viewJobVacancy/);
  }

  getVacancyRow(vacancyName) {
    return this.page.getByRole("row", { name: vacancyName });
  }

  async clickOnAdd() {
    await this.page.click(this.addButton);
  }

  async fillVacancyName(name) {
    await this.vacancyNameInput.fill(name);
  }

  async clickOnJobTitleDropdown() {
    await this.jobTitleDropdown.click();
  }

  async selectJobTitle(optionName) {
    await this.page.getByRole("option", { name: optionName }).click();
  }

  async fillDescription(description) {
    await this.descriptionInput.click();
    await this.descriptionInput.fill(description);
  }

  async fillHintsInput(hint) {
    await this.hiringManagerInput.click();
    await this.hiringManagerInput.fill(hint);
  }

  async selectHintOption(optionName) {
    await this.page.getByRole("option", { name: optionName }).click();
  }

  async fillNthTextbox(index, value) {
    await this.page.getByRole("textbox").nth(index).click();
    await this.page.getByRole("textbox").nth(index).fill(value);
  }

  async clickFirstSpan() {
    await this.page.locator("form span").first().click();
  }

  async clickNthSpan(index) {
    await this.page.locator("form span").nth(index).click();
  }

  async clickSaveButton() {
    await this.page.getByRole("button", { name: "Save" }).click();
  }
}

module.exports = RecruitmentVacanciesPage;
