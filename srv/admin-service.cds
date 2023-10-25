using { sap.capire.incidents as my } from '../db/schema';

@requires: 'admin'
service AdminService {

  entity Customers as projection on my.Customers;

}
