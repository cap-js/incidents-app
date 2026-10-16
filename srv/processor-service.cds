using {
  sap.capire.incidents as my,
} from '../db/schema';

@mcp @odata
service ProcessorService {
  entity Incidents as projection on my.Incidents excluding { embedding };
  entity SimilarIncidents as projection on my.SimilarIncidents;
  annotate my.Customers with @cds.autoexpose;

  function search(query: String) returns array of {
    ID: UUID;
    title: String;
    summary: String(2000);
    score: Decimal(7,6);
  };
}
