Feature: crud

  Background: connect to service
    Given we have started embedded server
      And we have connected to service ProcessorService

  # create
  Scenario: test create new Incident

    Create records using different create-steps

    Given we have created a new record in entity Incidents
        """
        {"title":"tests do work!"}
        """
    When we read all records
    And show the result
    Then we expect to have 5 records