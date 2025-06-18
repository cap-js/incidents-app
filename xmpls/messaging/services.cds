// Using local service implementation with remote service
using { ProcessorService } from '../../app/services';
annotate ProcessorService with @impl: 'srv/processor-service.js';

// add the additional field to display changes to email on UI
using from './app/incidents/field';