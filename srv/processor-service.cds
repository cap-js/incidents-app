using {sap.capire.incidents as my} from '../db/schema';
using {sap.print as sp} from '@cap-js/print';

service ProcessorService {
  entity Incidents as projection on my.Incidents;
  annotate my.Customers with @cds.autoexpose;

  entity Queues    as projection on sp.Queues;
}
