using { sap.capire.incidents as my } from '../db/schema';

service ProcessorService @(requires:'support') {

  entity Incidents as projection on my.Incidents;

  entity Customers @readonly as projection on my.Customers { *,
    firstName || ' ' || lastName as name: String
  };

}
