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

