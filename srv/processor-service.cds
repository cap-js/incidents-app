using {sap.capire.incidents as my} from '../db/schema';
using {sap.print as sp} from '@cap-js/print';

service ProcessorService { entity Incidents as projection on my.Incidents { 
  *, 
  @print.fileContent
  file,
  @print.fileName
  fileName
  } actions {
  @print
  action printIncidentFile(
        @Common: {
            ValueListWithFixedValues,
            ValueList: {
                $Type: 'Common.ValueListType',
                CollectionPath: 'Queues',
                Parameters: [{
                    $Type: 'Common.ValueListParameterInOut',
                    LocalDataProperty: qnameID,
                    ValueListProperty: 'ID'
                }]
            },
            Label: 'Print Queues',
        }
        @print.queue
        qnameID: String,
        @print.numberOfCopies
        @UI.ParameterDefaultValue : 1
        copies: Integer 
    );

  };
  annotate my.Customers with @cds.autoexpose;

  entity Queues    as projection on sp.Queues;
}
