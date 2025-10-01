@ios @regression-ios @testapp
Feature: iOS TestApp functionality

  @sum-computation
  Scenario: Text entry and sum computation
    Given the iOS app is launched
    When I enter "123" in the text field
    And I compute the sum
    Then the result should be "6"

  @alert-handling @negative
  Scenario: Alert handling
    Given the iOS app is launched
    When I trigger an alert
    Then the alert with title "Cool title" should be visible
    And I dismiss the alert
    And the alert with title "Cool title" should not be visible

@focus @ui-elements-visibility
  Scenario: Verify UI elements visibility
    Given the iOS app is launched
    Then the text field should be visible
    And the compute sum button should be visible
    And the show alert button should be visible