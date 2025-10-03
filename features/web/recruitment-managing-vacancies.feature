@web @regression-web @recruitment
Feature: Recruitment - Managing Vacancies

  @vacancy @severity:normal
  Scenario: Registering new vacancy
    Given I am on "Recruitment > Vacancies" page as the user:
      | user     | Admin    |
      | password | admin123 |
    When I click to add a new vacancy
    And I save the form with all the required entries
      | vacancyName   | Software Engineer in Test                                                                                   |
      | jobTitle      | QA Engineer                                                                                                 |
      | description   | Join our team as a Software Engineer in Test to design, develop, and maintain robust automated test suites. |
      | hiringManager | Carl Angus                                                                                                  |
      | active        | disabled                                                                                                    |
      | publishFeed   | disabled                                                                                                    |
    Then I see the new register added to the vacancies' list
