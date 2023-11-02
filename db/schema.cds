using { cuid, managed, sap.common.CodeList } from '@sap/cds/common';

namespace sap.capire.incidents;

/**
 * Customers using products sold by our company.
 * Customers can create support Incidents.
 */
entity Customers : cuid, managed {
  firstName     : String;
  lastName      : String;
  email         : EMailAddress;
  phone         : PhoneNumber;
  creditCardNo  : String(16) @assert.format: '^[1-9]\d{15}$';
  addresses     : Composition of many Addresses on addresses.customer = $self;
  incidents     : Association to many Incidents on incidents.customer = $self;
}
entity Addresses : cuid, managed {
  customer      : Association to Customers;
  city          : String;
  postCode      : String;
  streetAddress : String;
}


/**
 * Incidents created by Customers.
 */
entity Incidents : cuid, managed {
  customer      : Association to Customers;
  title         : String @title: 'Title';
  urgency       : Association to Urgency default 'M';
  status        : Association to Status default 'N';
  conversations : Composition of many Conversations on conversations.incidents = $self;
}

entity Status : CodeList {
  key code        : String enum {
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

entity Conversations : cuid, managed {
  incidents : Association to Incidents;
  timestamp : DateTime @cds.on.insert: $now;
  author    : String @cds.on.insert: $user;
  message   : String;
}

type EMailAddress : String;
type PhoneNumber  : String;
