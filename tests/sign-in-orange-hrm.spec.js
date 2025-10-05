import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto(process.env.WEB_BASE_URL);
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await page.waitForSelector('.oxd-userdropdown-name', { state: 'visible' });

  const userDropdown = await page.$('.oxd-userdropdown-name');
  expect(userDropdown).toBeTruthy();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
