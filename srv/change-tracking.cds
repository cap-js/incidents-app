using { ProcessorService.Incidents } from './processor-service';

annotate Incidents with {
  customer @changelog: [customer.name];
  title    @changelog;
  status   @changelog;
}

annotate Incidents.conversation with @changelog: [author, timestamp] {
  message  @changelog @Common.Label: 'Message';
}
