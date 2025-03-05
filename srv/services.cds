using { sap.capire.incidents as my } from '../db/schema';
using { Attachments } from '@cap-js/attachments';

/**
 * Service used by support personell, i.e. the incidents' 'processors'.
 */
service ProcessorService {
  extend my.Incidents with {
  attachments: Composition of many Attachments;
  }
  entity Incidents as projection on my.Incidents;
  entity Customers @readonly as projection on my.Customers;
}

/**
 * Service used by administrators to manage customers and incidents.
 */
service AdminService {
  entity Customers as projection on my.Customers;
  entity Incidents as projection on my.Incidents;
}

annotate ProcessorService.Incidents with @odata.draft.enabled; 
annotate ProcessorService with @(requires: 'support');
annotate AdminService with @(requires: 'admin');
