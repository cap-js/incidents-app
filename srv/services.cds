using { sap.capire.incidents as my } from '../db/schema';

/**
 * Service used by support personell, i.e. the incidents' 'processors'.
 */
service ProcessorService @(requires:'support') {
  entity Incidents as projection on my.Incidents;
  entity Customers @readonly as projection on my.Customers { *,
    firstName || ' ' || lastName as name: String
  };
}

/**
 * Service used by administrators to manage customers and incidents.
 */
service AdminService @(requires:'admin') {
  entity Customers as projection on my.Customers;
  entity Incidents as projection on my.Incidents;
}
