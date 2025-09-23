 @api @regression-api
Feature: API Testing with Playwright

  @get-user-details @smoke-api
  Scenario: Get user details
    Given I send a GET request to "/users/1"
    Then the response status should be 200
    And the response should contain "Leanne Graham"

  @post-new-user
  Scenario: Create a new user
    Given I send a POST request to "/users" with body:
      """
      {
        "name": "John Doe",
        "username": "johndoe"
      }
      """
    Then the response status should be 201
    And the response should contain "johndoe"