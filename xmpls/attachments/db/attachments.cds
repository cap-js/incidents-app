
using { sap.capire.incidents as my } from './schema';
using { Image, Attachments } from '@cap-js/attachments';

extend my.Incidents with {
  attachments: Composition of many Attachments;
}

extend my.Customers with {
  avatar: Image;
}