
function getOorsprongWS() {
  return {
    namespaceUrl: "http://www.oorsprong.org/websamples.countryinfo",
    actions: {
      capitalCity: "/CapitalCity"
    },
    respNode: {
      capitalCityResult: "Envelope.Body.CapitalCityResponse.CapitalCityResult"
    }
  };
}

module.exports = { getOorsprongWS };
