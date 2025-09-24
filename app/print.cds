using ProcessorService as service from '../srv/processor-service';
using { sap.capire.incidents as my } from '../db/schema';
using from './incidents/annotations';

// Extend the service to add the print action
extend service.Incidents with actions {
  action printIncidentFile();
}

// UI annotations for the print functionality
annotate service.Incidents with @(
  UI.Identification : [
    {
      $Type : 'UI.DataFieldForAction',
      Action : 'service.printIncidentFile',
      Label : '{i18n>Print}',
      IconUrl : 'sap-icon://print'
    }
  ]
);

// Extend the base entity with a pdf
extend my.Incidents with {
    file : LargeBinary @Core.MediaType: 'application/pdf';
    fileName : String @readonly;
}

// Create a field group for the file
annotate service.Incidents with @(
  UI.FieldGroup #PrintFileGroup : {
    $Type : 'UI.FieldGroupType',
    Data : [
      {
        $Type : 'UI.DataField',
        Value : fileName,
        Label : 'File Name'
      }
    ]
  }
);

// Add the file facet to existing facets
annotate service.Incidents with @(
  UI.Facets: [
    ...,
    {
      $Type : 'UI.ReferenceFacet',
      ID : 'PrintFileFacet',
      Label : 'File Attachment',
      Target : '@UI.FieldGroup#PrintFileGroup'
    }
  ]
); 
