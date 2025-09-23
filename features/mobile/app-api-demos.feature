@android @regression-android @api-demos
Feature: Android - API Demos App Navigation
  As a mobile app user
  I want to navigate through the API Demos sections
  So that I can verify accessibility, animation, and app elements

  Background:
    Given the Android app is launched
    And I am on the API Demos main page

  @navigating-to-accessibility @smoke-android
  Scenario: Navigate to Accessibility section
    When I navigate to the "Accessibility" section
    Then the Accessibility Node Provider page should be displayed

  @navigating-to-animation-bouncing-balls
  Scenario: Navigate to Animation Bouncing Balls
    When I navigate to the "Animation" section
    And I open "Bouncing Balls"
    Then the Bouncing Balls animation should be displayed

  @main-page-elements
  Scenario: Verify main page elements are visible
    Then I should see the "Accessibility" option
    And I should see the "Animation" option
    And I should see the "App" option
