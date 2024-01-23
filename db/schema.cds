using { cuid, managed, sap.common.CodeList } from '@sap/cds/common';

namespace sap.capire.incidents;

/**
 * Customers using products sold by our company.
 * Customers can create support Incidents.
 */
entity Customers : cuid, managed {
  firstName      : String;
  lastName       : String;
  name           : String = firstName ||' '|| lastName;
  email          : EMailAddress;
  phone          : PhoneNumber;
  creditCardNo   : String(16) @assert.format: '^[1-9]\d{15}$';
  addresses      : Composition of many Addresses on addresses.customer = $self;
  incidents      : Association to many Incidents on incidents.customer = $self;
}

entity Addresses : cuid, managed {
  customer       : Association to Customers;
  city           : String;
  postCode       : String;
  streetAddress  : String;
}


/**
 * Incidents created by Customers.
 */
entity Incidents : cuid, managed {
  customer       : Association to Customers;
  title          : String @title: 'Title';
  urgency        : Association to Urgency;
  status         : Association to Status;
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

type EMailAddress : String;
type PhoneNumber  : String;
