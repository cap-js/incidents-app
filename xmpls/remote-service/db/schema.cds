// Copied from vanilla incidents management - only change is Customers.ID
using { cuid, managed, sap.common.CodeList } from '@sap/cds/common';

namespace sap.capire.incidents;

/**
 * Customers using products sold by our company.
 * Customers can create support Incidents.
 */
entity Customers : managed {
  // This was changed from UUID to String, as SAP S/4HANA Cloud Business Partner API uses a String as ID
  key ID        : String;
  firstName     : String;
  lastName      : String;
  email         : EMailAddress;
  phone         : PhoneNumber;
  incidents     : Association to many Incidents on incidents.customer = $self;
}

/**
 * Incidents created by Customers.
 */
entity Incidents : cuid, managed {
  customer      : Association to Customers;
  title         : String @title: 'Title';
  urgency       : Association to Urgency;
  status        : Association to Status;
  conversations : Composition of many Conversations
                    on conversations.incidents = $self;
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
