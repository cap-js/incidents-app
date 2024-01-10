using { sap.capire.incidents as my } from '../db/schema';

/**
 * Service used by support personell, i.e. the incidents' 'processors'.
 */
service ProcessorService @(requires:'support') {
  entity Incidents as projection on my.Incidents;
  entity Customers @readonly as projection on my.Customers;
}

/**
 * Service used by administrators to manage customers and incidents.
 */
service AdminService @(requires:'admin') {
  entity Customers as projection on my.Customers;
  entity Incidents as projection on my.Incidents;
}

service ManagerService {
  entity Incidents as projection on my.Incidents;
  entity IncidentsQView as select from my.Incidents, my.Incidents.conversation {
    key Incidents.ID,
    title,
    customer.name as customer,
    customer.email as email,
    status.descr as status,
    urgency.code as urgency,
    createdAt,
    count(Incidents.conversation.message) as comments: Integer

  } where Incidents.conversation.ID = conversation.ID
    group by Incidents.ID
}