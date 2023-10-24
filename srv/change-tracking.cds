using { ProcessorService as my } from './processor-service';

annotate my.Incidents {
  customer @changelog: [customer.name];
  title    @changelog;
  status   @changelog;
}

annotate my.Conversations with @changelog: [author, timestamp] {
  message  @changelog @Common.Label: 'Message';
}

// REVISIT: That should go into @capire/incidents base models
annotate my.Incidents with @title: '{i18n>Incidents}';
annotate my.Conversations with @title: '{i18n>Conversations}';
annotate my.Customers with @title: '{i18n>Customers}';
