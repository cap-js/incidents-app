
using { sap.capire.incidents as my } from '../db/schema';
using { Attachments } from '@cap-js/attachments';

extend my.Incidents with {
  attachments: Composition of many Attachments;
}