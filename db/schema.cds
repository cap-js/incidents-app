using { cuid, managed, sap.common.CodeList } from '@sap/cds/common';
using { sap.capire.incidents.Customers } from './dp-mashup';

namespace sap.capire.incidents;

/**
 * Incidents created by Customers.
 */
entity Incidents : cuid, managed {
  customer       : Association to Customers;
  title          : String @title: 'Title';
  urgency        : Association to Urgency default 'M';
  status         : Association to Status default 'N';
  conversation   : Composition of many {
    key ID    : UUID;
    timestamp : type of managed:createdAt;
    author    : type of managed:createdBy;
    message   : String;
  };
}

entity Status : CodeList {
  key code    : String enum {
    new        = 'N';
    assigned   = 'A';
    in_process = 'I';
    on_hold    = 'H';
    resolved   = 'R';
    closed     = 'C';
  };
  criticality : Integer;
}

entity Urgency : CodeList {
  key code : String enum {
    high   = 'H';
    medium = 'M';
    low    = 'L';
  };
}
