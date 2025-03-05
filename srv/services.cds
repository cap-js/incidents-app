using { sap.capire.incidents as my } from '../db/schema';

/**
 * Service used by support personell, i.e. the incidents' 'processors'.
 */
service ProcessorService @(requires: 'support') {
  entity Incidents as projection on my.Incidents;
  // TODO: Add actions
}

service CustomersService @(requires: ['support', 'admin']) {
  entity Customers as projection on my.Customers;
}