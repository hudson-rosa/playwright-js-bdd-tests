/**
 * Attaches a screenshot to the Cucumber world context.
 * @param {object} world - The Cucumber world context (`this` in steps).
 * @param {string} [label] - Optional label to log in the console.
 */
async function attachScreenshot(world, label = '') {
    if (!world?.attach || typeof world.attach !== 'function') {
      throw new Error('The "attach" function is not available on the World instance.');
    }
  
    const page = world.getPage?.();
    if (!page) {
      throw new Error('No active page found in world.getPage().');
    }
  
    const screenshot = await page.screenshot();
    await world.attach(screenshot, "image/png");
  
    if (label) {
      console.log(`📸 Screenshot taken from: ${label}`);
    }
  }
  
  module.exports = {
    attachScreenshot,
  };