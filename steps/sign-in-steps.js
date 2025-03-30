const { Given, When, Then, After } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { chromium } = require("playwright");
require('dotenv').config();

let browser;
let page;

Given('I am on OrangeHRM website at Sign In page', async function() {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  await page.goto(process.env.PRODUCTION_URL);
});

When('I sign in using valid account credentials', async function(dataTable) {
  const credentials = dataTable.rowsHash();
  console.log("Extracted credentials:", credentials);
  await page.fill('input[name="username"]', credentials.user);
  await page.fill('input[name="password"]', credentials.password);
  await page.click('button[type="submit"]');
});

Then('my session loads at the Dashboard page', async function() {
  await expect(page).toHaveURL(/dashboard/);
  await page.waitForSelector('.oxd-userdropdown-name', { state: 'visible' });

  const userDropdown = await page.$('.oxd-userdropdown-name');
  expect(userDropdown).toBeTruthy();
});

When('I sign in using invalid account credentials', async function() {
  await page.fill('input[name="username"]', "invalidUser");
  await page.fill('input[name="password"]', "wrongPass");
  await page.click('button[type="submit"]');
});

Then('the message {string} is displayed', async function(expectedMessage) {
  const errorMessage = await page.textContent(".oxd-alert-content");
  expect(errorMessage).toContain(expectedMessage);
});


After(async function () {
    if (browser) {
        await browser.close();
    }
});