using { sap.capire.incidents as my } from '../db/schema';

service ProcessorService {
  entity Incidents as projection on my.Incidents;
  annotate my.Customers with @cds.autoexpose;
}
