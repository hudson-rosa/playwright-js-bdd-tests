// support/api/soap/soap-parser.js

const { parseStringPromise, processors } = require("xml2js");

async function parseSoapResponse(world) {
  const text = await world.response.text();

  if (!text.includes("Envelope")) {
    throw new Error(`Expected SOAP XML but received:\n${text}`);
  }

  // Removing unnecessary arrays/namespaces and simplifying access to the SOAP body
  const options = {
    tagNameProcessors: [processors.stripPrefix],
    explicitArray: false
  };

  console.log("\nSTATUS:", world.response.status());
  console.log("\nHEADERS:", world.response.headers());
  console.log("\nRAW RESPONSE:\n", text);

  try {
    world.soapBody = await parseStringPromise(text, options);
    return world.soapBody;
  } catch (err) {
    throw new Error(`Failed to parse SOAP response:\n${text}`);
  }
}

module.exports = { parseSoapResponse };
