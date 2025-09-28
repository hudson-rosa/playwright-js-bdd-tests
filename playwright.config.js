// @ts-check
import { defineConfig, devices } from "@playwright/test";
import os from "os";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  globalTimeout: 120000,
  testDir: "./tests",

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  reporter: [
    ["dot"],
    ["html"],
    ["list"],
    // [
    //   "allure-playwright",
    //   {
    //     outputFolder: "allure-results",
    //     environmentInfo: {
    //       os_platform: os.platform(),
    //       os_release: os.release(),
    //       os_version: os.version(),
    //       node_version: process.version
    //     }
    //   }
    // ],
    [
      "json",
      {
        outputFile: "jsonReports/jsonReport.json"
      }
    ]
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // baseURL: 'http://127.0.0.1:3000',
    trace: "on-first-retry",
    screenshot: "on",
    video: "on"
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      timeout: 100000
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      timeout: 100000
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      timeout: 200000
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    //   timeout: 100000
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    //   timeout: 100000
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    //   timeout: 100000
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    //   timeout: 100000
    // },
  ]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
