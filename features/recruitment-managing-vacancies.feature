@regression @recruitment
Feature: Recruitment - Managing Vacancies

  Background: Accessing Sign In page
    Given I am on OrangeHRM website at Sign In page

  @vacancy
  Scenario: Successful sign in to OrangeHRM
    Given I am on "Recruitment > Vacancies" page
    When I tap "Add" to register a new vacancy
    And I save the form with with all the required entries
      | vacancy name   | Admin                     |
      | job title      | Software Engineer in Test |
      | hiring manager | Automation Tester         |
      | publish feed   | disabled                  |
    Then I see the new register added to the vacancies' list
