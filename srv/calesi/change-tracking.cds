using { ProcessorService } from './processor-service';

annotate ProcessorService.Incidents
with {
  customer @changelog: [customer.name];
  title    @changelog;
  status   @changelog;
}

annotate ProcessorService.Incidents.conversation
with @changelog: [author, timestamp] {
  message  @changelog @Common.Label: 'Message';
}
