using { sap.capire.incidents as my } from '../db/schema';

service AdminService @(requires: 'admin') {
  entity Customers as projection on my.Customers;
  entity Incidents as projection on my.Incidents;
}
