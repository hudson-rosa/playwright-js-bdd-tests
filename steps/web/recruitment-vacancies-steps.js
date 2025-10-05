// steps/web/recruitment-vacancies.steps.js

const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { SignInPage, DashboardPage, NavigationPage, RecruitmentVacanciesPage } = require("../../pages/page_modules/web-index");
require("dotenv").config();

let signInPage;
let navigationPage;
let recruitmentVacanciesPage;

Given(/^I am on "(.*)" page as the user:$/, { timeout: 60000 }, async function (navigation, dataTable) {
  const credentials = dataTable.rowsHash();
  const page = this.getPage();
  navigationPage = new NavigationPage(this.getPage());
  signInPage = new SignInPage(this.getPage());

  await signInPage.openPage();
  await signInPage.fillUsername(credentials.user);
  await signInPage.fillPassword(credentials.password);
  await signInPage.submitLogin();

  await expect(this.page).toHaveURL(/dashboard/);

  await navigationPage.openFromUrl(navigation, 0);
  await navigationPage.openTab(navigation, 1);
});

When("I click to add a new vacancy", async function () {
  recruitmentVacanciesPage = new RecruitmentVacanciesPage(this.getPage());
  await recruitmentVacanciesPage.awaitForVacanciesPage();
  await recruitmentVacanciesPage.clickOnAdd();
});

When("I save the form with all the required entries", async function (dataTable) {
  const data = dataTable.rowsHash();
  recruitmentVacanciesPage = new RecruitmentVacanciesPage(this.getPage());
  await recruitmentVacanciesPage.fillVacancyName(data.vacancyName);
  await recruitmentVacanciesPage.clickOnJobTitleDropdown();
  await recruitmentVacanciesPage.selectJobTitle(data.jobTitle);
  await recruitmentVacanciesPage.fillDescription(data.description);
  await recruitmentVacanciesPage.fillHintsInput(data.hiringManager);
  await recruitmentVacanciesPage.selectHintOption(data.hiringManager);
  await recruitmentVacanciesPage.fillNthTextbox(0, data.vacancyName);
  await recruitmentVacanciesPage.clickFirstSpan();
  await recruitmentVacanciesPage.clickNthSpan(1);
  await recruitmentVacanciesPage.clickSaveButton();
});

Then("I see the new register added to the vacancies' list", async function (dataTable) {
  const data = dataTable ? dataTable.rowsHash() : {};
  const vacancyName = data.vacancyName || "Default Vacancy";

  recruitmentVacanciesPage = new RecruitmentVacanciesPage(this.getPage());
  const vacancyRow = recruitmentVacanciesPage.getVacancyRow(vacancyName);

  await expect(vacancyRow).toBeVisible({ timeout: 10000 });
});
