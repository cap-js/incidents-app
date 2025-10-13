using { sap.capire.incidents as my } from '../db/schema';
using { sap.attachments.Attachments } from '@cap-js/sdm';
using {sap.common.CodeList} from '@sap/cds/common';
/**
 * Service used by support personell, i.e. the incidents' 'processors'.
 */
@requires:'authenticated-user'
service ProcessorService {
  entity Incidents as projection on my.Incidents;
  entity Customers @readonly as projection on my.Customers;
  entity Incidents.attachments as projection on my.Incidents.attachments
  actions {
    @(Common.SideEffects : {TargetEntities: ['']},)
    action createLink(
      in:many $self,
      @mandatory @Common.Label:'Name' name: String @UI.Placeholder: 'Enter a name for the link',
      @mandatory @assert.format:'^(https?:\/\/)(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}|localhost)(:\d{2,5})?(\/[^\s]*)?$' @Common.Label:'URL' url: String @UI.Placeholder: 'Example: https://www.example.com'
    );
    action editLink(
      @mandatory @assert.format:'^(https?:\/\/)(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}|localhost)(:\d{2,5})?(\/[^\s]*)?$'
      @Common.Label:'URL' url: String @UI.Placeholder: 'Example: https://www.example.com'
    );
    action openAttachment() returns { value: String; };
  }
}

extend my.Incidents with { attachments: Composition of many Attachments }

extend Attachments with {
    customProperty1 : Association to WDIRSCodeList
        @SDM.Attachments.AdditionalProperty: {
            name: 'Working:DocumentInfoRecordString'
        } 
        @(title: 'DocumentInfoRecordString');
    customProperty2 : Integer
        @SDM.Attachments.AdditionalProperty: {
            name: 'Working:DocumentInfoRecordInt'
        };
    customProperty3 : String
    @SDM.Attachments.AdditionalProperty: {
        name: 'abc:myId1'
    }  
    @(title: 'id1');
    customProperty4 : String
    @SDM.Attachments.AdditionalProperty: {
        name: 'abc:myId2'
    }  
    @(title: 'id2');
    customProperty5 : DateTime
    @SDM.Attachments.AdditionalProperty: {
        name: 'Working:DocumentInfoRecordDate'
    }  
    @(title: 'DocumentInfoRecordDate');
    customProperty6 : Boolean
    @SDM.Attachments.AdditionalProperty: {
        name: 'Working:DocumentInfoRecordBoolean'
    }  
    @(title: 'DocumentInfoRecordBoolean');
}

entity WDIRSCodeList : CodeList {
    key code  : String(30) @Common.Text : name @Common.TextArrangement: #TextFirst;
};
/**
 * Service used by administrators to manage customers and incidents.
 */
// service AdminService @(requires:'admin') {
//   entity Customers as projection on my.Customers;
//   entity Incidents as projection on my.Incidents;
// }
