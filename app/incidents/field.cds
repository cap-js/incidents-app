  using ProcessorService as service from '../../srv/services';
  using from './annotations.cds';
  annotate service.Incidents with @(
  /*adding email to the object page enables users to view the
  changes recieved via Messaging/Eventing*/
  UI.FieldGroup #GeneratedGroup : {
  Data : [...,
    {
      $Type : 'UI.DataField',
      Value : customer.email,
      Label : '{i18n>email}'
    }
  ]
  });

  annotate service.Customers with {
    email @readonly
  };  