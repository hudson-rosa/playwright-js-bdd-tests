@api @soap-api @country-info @regression-soap
Feature: Country Info SOAP API

  As a QA engineer
  I want to validate SOAP services
  So that I can ensure correct responses from external systems

  @capital-city @severity:critical
  Scenario: Get capital city of Luxembourg
    Given I have the ready envelope "capitalCity.xml"
    When I send a SOAP request with action "capitalCity" and variables:
      | countryCode | LU |
    Then the SOAP response status should be 200
    And the SOAP node "capitalCityResult" should be "Luxembourg"