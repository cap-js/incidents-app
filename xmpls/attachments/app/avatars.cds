using from '@capire/incidents/app/services';
using from '../db/attachments';

annotate ProcessorService.Incidents with @(UI.HeaderInfo: {
  TypeImageUrl: customer.avatar.url
});
