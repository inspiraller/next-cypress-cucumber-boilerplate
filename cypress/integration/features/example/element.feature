Feature: Testing element exists
  Scenario: Element exists
    Given I visit '/'
    Then element '[data-testid="count-h1"]' exists
