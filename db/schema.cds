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

entity Conversations : cuid {
  incidents : Association to Incidents;
  timestamp : type of managed:createdAt;
  author    : type of managed:createdBy;
  message   : String;
}

type EMailAddress : String;
type PhoneNumber  : String;
