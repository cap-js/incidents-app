
using { sap.capire.incidents as my } from './schema';
using { Attachments } from '@cap-js/attachments';

extend my.Incidents with {
  references: Composition of many Attachments;
}
