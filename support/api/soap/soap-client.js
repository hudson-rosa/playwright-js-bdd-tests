// support/api/soap/soap-client.js

const fs = require("fs");
const path = require("path");

async function sendSoapRequest(world, envelopePath, variables = {}, action) {
  const fullPath = path.resolve(__dirname, envelopePath);
  let xml = fs.readFileSync(fullPath, "utf8");

  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, "g");
    xml = xml.replace(regex, variables[key]);
    console.log(`Replaced {{${key}}} with "${variables[key]}"`);
  }

  world.soapRequest = xml;

  world.response = await world.apiContext.post(process.env.SOAPAPI_BASE_URL, {
    headers: {
      "Content-Type": "text/xml;charset=UTF-8",
      "SOAPAction": action
    },
    data: xml
  });
  
  console.log("================================================");
  console.log(" - SOAP ACTION:", action);
  console.log(" - URL:", process.env.SOAPAPI_BASE_URL);
  console.log(" - SOAP REQUEST:\n>---------------------\n", xml, "\n---------------------<");
  return world.response;
}

module.exports = { sendSoapRequest };
