const { Given, When, Then, Before, AfterStep } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { SignInPage, DashboardPage, NavigationPage, RecruitmentVacanciesPage } = require("../../pages/page_modules/index");
const { attachScreenshot } = require("../../support/utils/screenshotHelper.js");
require("dotenv").config();

let signInPage;
let navigationPage;
let recruitmentVacanciesPage;

AfterStep(async function() {
  await attachScreenshot(this, "vacancies");
});

Given(/^I am on "(.*)" page as the user:$/, async function(navigation, dataTable) {
  const credentials = dataTable.rowsHash();
  const page = this.getPage();
  navigationPage = new NavigationPage(this.getPage());
  signInPage = new SignInPage(this.getPage());

  await signInPage.openPage();
  await signInPage.fillUsername(credentials.user);
  await signInPage.fillPassword(credentials.password);
  await signInPage.submitLogin();
  await navigationPage.openFromUrl(navigation, 0);
  await navigationPage.openTab(navigation, 1);
});

When(/^I tap "(.*)" to register a new vacancy$/, async function(buttonName) {
  recruitmentVacanciesPage = new RecruitmentVacanciesPage(this.getPage());
  await recruitmentVacanciesPage.clickOnAdd();
});

When("I save the form with with all the required entries", async function(dataTable) {
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

Then("I see the new register added to the vacancies' list", function() {
  // Write code here that turns the phrase above into concrete actions
  return "to-do";
});
