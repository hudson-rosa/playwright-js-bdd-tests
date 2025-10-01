@ios @checkout @saucelabs-my-demo
Feature: Checkout Payment Page

  Background:
    Given the app is restarted
    And I navigate to the checkout payment page

  @validation
  Scenario: Show all card data errors when submitting empty card form
    When I tap the review order button
    Then I should see the following card error messages:
      | field           | message              |
      | fullName        | Value looks invalid. |
      | cardNumber      | Value looks invalid. |
      | expirationDate  | Value looks invalid. |
      | securityCode    | Value looks invalid. |

  @validation
  Scenario: Show card data errors for incorrect inputs
    When I fill in card data with:
      | fullName       | 1234                  |
      | cardNumber     | 5555555555555555      |
      | expirationDate | 0102                  |
      | securityCode   | 12345                 |
    Then I should see the following card error messages:
      | field           | message              |
      | fullName        | Value looks invalid. |
      | cardNumber      | Value looks invalid. |
      | expirationDate  | Value looks invalid. |
      | securityCode    | Value looks invalid. |

  @validation
  Scenario: Show all billing address errors when submitting empty billing form
    When I enable the billing address form
    And I tap the review order button
    Then I should see the following billing error messages:
      | field           | message                        |
      | fullName        | Please provide your full name. |
      | addressLineOne  | Please provide your address.   |
      | city            | Please provide your city.      |
      | zipCode         | Please provide your zip code.  |
      | country         | Please provide your country.   |

  @happy
  Scenario: Submit valid card data
    When I fill in card data with:
      | fullName       | Sauce Bot             |
      | cardNumber     | 5555555555554444      |
      | expirationDate | 0325                  |
      | securityCode   | 123                   |
    And I tap the review order button
    Then the review order page should be displayed

  @happy
  Scenario: Submit valid card and minimal billing address data
    When I fill in card data with:
      | fullName       | Sauce Bot             |
      | cardNumber     | 5555555555554444      |
      | expirationDate | 0325                  |
      | securityCode   | 123                   |
    And I enable the billing address form
    And I fill in billing data with:
      | fullName       | Sauce Bot      |
      | addressLineOne | Bot Street 2   |
      | city           | Sauce City     |
      | zipCode        | 1243BB         |
      | country        | UK             |
    And I tap the review order button
    Then the review order page should be displayed

  @happy
  Scenario: Submit valid card and full billing address data
    When I fill in card data with:
      | fullName       | Sauce Bot      |
      | cardNumber     | 5555555555554444 |
      | expirationDate | 0325           |
      | securityCode   | 123            |
    And I enable the billing address form
    And I fill in billing data with:
      | fullName       | Sauce Bot      |
      | addressLineOne | Bot Street 2   |
      | addressLineTwo | Apartment 2    |
      | city           | Sauce City     |
      | stateRegion    | Somewhere      |
      | zipCode        | 1243BB         |
      | country        | UK             |
    And I tap the review order button
    Then the review order page should be displayed
