// support/utils/screenshot-helper.js

const fs = require("fs");
const path = require("path");
const sanitizeFilename = require("sanitize-filename");

/**
 * Attaches a screenshot to the Cucumber world context.
 * @param {object} world - The Cucumber world context (`this` in steps).
 * @param {string} [label] - Optional label to log in the console.
 */
async function attachScreenshotOfWebPage(world, label = "") {
  try {
    if (!page || page.isClosed?.()) {
      console.warn("Page is closed. Skipping screenshot for:", scenario.pickle.name);
      return;
    }
    if (!world?.attach || typeof world.attach !== "function") {
      throw new Error('The "attach" function is not available on the World instance.');
    }

    const page = world.getPage?.();
    if (!page) {
      throw new Error("No active page found in world.getPage().");
    }

    const screenshot = await page.screenshot();
    await world.attach(screenshot, "image/png");

    if (label) {
      console.log(`📸 Screenshot taken from: ${label}`);
    }
  } catch (err) {
    console.warn("⚠️ Could not take mobile screenshot:", err.message);
  }
}

async function attachScreenshotOfMobileScreen(world, label = "") {
  if (!world?.attach || typeof world.attach !== "function") {
    throw new Error('The "attach" function is not available on the World instance.');
  }

  const driver = world.androidDriver || world.iosDriver;
  if (!driver) {
    throw new Error("No active mobile driver found (androidDriver or iosDriver).");
  }

  const screenshotBase64 = await driver.takeScreenshot();
  const screenshotBuffer = Buffer.from(screenshotBase64, "base64");

  await world.attach(screenshotBuffer, "image/png");

  if (label) {
    console.log(`📸 Screenshot taken from: ${label}`);
  }
}

/** Captures and attaches a screenshot when a scenario fails.
 * @param {object} world - The Cucumber world context (`this` in steps).
 * @param {object} scenario - The Cucumber scenario object.
 * @param {object} page - The Playwright page instance.
 */
async function attachScreenshotOfWebPageFailure(world, scenario, page) {
  try {
    if (!page || page.isClosed?.()) {
      console.warn("Page is closed. Skipping screenshot for:", scenario.pickle.name);
      return;
    }
    const screenshotsDir = path.resolve(__dirname, `../../allure-results/${process.env.BROWSER}`);
    console.log("--> Capturing screenshot..." + screenshotsDir);

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const filePath = prepareScreenshotFilePathname(scenario, screenshotsDir);
    const screenshotBuffer = await page.screenshot({ path: filePath, type: "png" });

    console.log(`📸 Screenshot from failure saved at: ${filePath}`);
    world.attach(screenshotBuffer, "image/png");
  } catch (err) {
    console.warn("⚠️ Could not take web screenshot:", err.message);
  }
}

/**
 * Capture and attach a screenshot from a mobile driver (Appium) when a scenario fails.
 * @param {object} world - The Cucumber world context (`this` in steps).
 * @param {object} scenario - The Cucumber scenario object.
 * @param {object} driver - The Appium driver instance.
 * @param {string} platform - The mobile platform ("android" or "ios").
 */
async function attachScreenshotOfMobileScreenFailure(world, scenario, driver, platform = "android") {
  const screenshotsDir = path.resolve(__dirname, `../../allure-results/${platform}`);

  try {
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const filePath = prepareScreenshotFilePathname(scenario, screenshotsDir);
    const screenshotBase64 = await driver.takeScreenshot();
    const screenshotBuffer = Buffer.from(screenshotBase64, "base64");

    fs.writeFileSync(filePath, screenshotBuffer);

    console.log(`📸 [MOBILE] Screenshot from failure saved at: ${filePath}`);
    await world.attach(screenshotBuffer, "image/png");
  } catch (err) {
    console.warn("⚠️ Could not take mobile screenshot:", err.message);
  }
}

function prepareScreenshotFilePathname(scenario, screenshotsDir) {
  const scenarioName = sanitizeFilename(scenario.pickle.name);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${timestamp}_${scenarioName}.png`;
  const filePath = path.join(screenshotsDir, fileName);
  return filePath;
}

module.exports = {
  attachScreenshotOfWebPage,
  attachScreenshotOfMobileScreen,
  attachScreenshotOfWebPageFailure,
  attachScreenshotOfMobileScreenFailure
};
