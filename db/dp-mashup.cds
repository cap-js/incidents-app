using { sap.s4com.Customer.v1 as dpCust } from 'sap-s4com-customer-v1';

namespace sap.capire.incidents;

// consumption views
// - only simple projections
// - renaming of elements allowed
// - no join, union, where, group by, order by, ...
// - no expressions (arithmetic, paths, ...)

//@federated
entity Customers as projection on dpCust.Customer {
  key Customer as ID,
  CustomerName as name,
  Country as country,
  CityName as city,
  PostalCode as zip,
  StreetName as street
}

