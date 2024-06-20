using { ProcessorService.Incidents } from './services';

annotate Incidents with {
  customer @changelog: [customer.name];
  title    @changelog;
  status   @changelog;
}

annotate Incidents.conversation with @changelog: [author, timestamp] {
  message  @changelog @Common.Label: 'Message';
}
