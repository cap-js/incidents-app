// Using local service implementation
using { ProcessorService } from '../../app/services';
annotate ProcessorService with @impl: 'srv/processor-service.js';
using from './app/incidents/field';
