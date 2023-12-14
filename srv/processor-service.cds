using { sap.capire.incidents as my } from '../db/schema';

service ProcessorService @(requires:'support') {

  entity Incidents as projection on my.Incidents;

  @readonly entity Customers as projection on my.Customers { *,
    firstName || ' ' || lastName as name: String
  };

}
