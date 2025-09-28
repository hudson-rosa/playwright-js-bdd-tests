const fs = require("fs");
const path = require("path");
const sanitizeFilename = require("sanitize-filename");

/**
 * Attaches a screenshot to the Cucumber world context.
 * @param {object} world - The Cucumber world context (`this` in steps).
 * @param {string} [label] - Optional label to log in the console.
 */
async function attachScreenshot(world, label = "") {
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
}

/** Captures and attaches a screenshot when a scenario fails.
 * @param {object} world - The Cucumber world context (`this` in steps).
 * @param {object} scenario - The Cucumber scenario object.
 * @param {object} page - The Playwright page instance.
 */
async function attachScreenshotFromFailure(world, scenario, page) {
  const screenshotsDir = path.resolve(__dirname, `../allure-results`);
  console.log("--> Capturing screenshot..." + screenshotsDir);

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const scenarioName = sanitizeFilename(scenario.pickle.name);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${timestamp}_${scenarioName}.png`;
  const filePath = path.join(screenshotsDir, fileName);

  const screenshotBuffer = await page.screenshot({ path: filePath, type: "png" });

  console.log(`📸 Attaching screenshot from failure at: ${filePath}`);
  world.attach(screenshotBuffer, "image/png");
}

module.exports = {
  attachScreenshot,
  attachScreenshotOnFailure: attachScreenshotFromFailure
};
