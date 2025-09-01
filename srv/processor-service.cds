using { sap.capire.incidents as my } from '../db/schema';

service ProcessorService {
  entity Incidents as projection on my.Incidents {
    *,
    customer.{ street || ', ' || zip || ' ' || city as address : String }
  }
  annotate my.Customers with @cds.autoexpose;
}
