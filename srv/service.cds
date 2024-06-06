using { sap.capire.incidents as my } from '../db/schema';
using {  Attachments } from '@cap-js/sdm';
/**
 * Service used by support personell, i.e. the incidents' 'processors'.
 */
@requires:'authenticated-user'
service ProcessorService {
  entity Incidents as projection on my.Incidents;
  entity Customers @readonly as projection on my.Customers;
}
extend my.Incidents with{
attachments:Composition of  many Attachments ;
}
/**
 * Service used by administrators to manage customers and incidents.
 */
// service AdminService @(requires:'admin') {
//   entity Customers as projection on my.Customers;
//   entity Incidents as projection on my.Incidents;
// }
