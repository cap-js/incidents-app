using ProcessorService as service from '../srv/processor-service';
using { sap.capire.incidents as my } from '../db/schema';
using from './incidents/annotations';

// UI annotations for the print functionality
annotate service.Incidents with @(
  UI.Identification : [
    {
      $Type : 'UI.DataFieldForAction',
      Action : 'ProcessorService.printIncidentFile',
      Label : '{i18n>Print}',
      IconUrl : 'sap-icon://print'
    }
  ]
);

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
