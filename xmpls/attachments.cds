
using { sap.capire.incidents.Incidents } from '../app/services';
using { Attachments } from '@cap-js/attachments';

extend Incidents with {
  attachments: Attachments
}
