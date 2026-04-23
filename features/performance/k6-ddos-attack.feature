@perf @ddos
Feature: DDoS

  @resilience @severity:critical
  Scenario Outline: System is resilient during spike and soak requests
    Given I am on "<endpoint>" service as the user
    When the endpoint bursts with a high volume of traffic in seconds                                                                                                   |
    Then I see that the system is resilient by handling the rate-limit with a "429" error

    Examples:
      | endpoint                |
      | https://httpbin.org/get |