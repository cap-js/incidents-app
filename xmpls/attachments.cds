
using { sap.capire.incidents as my } from '../app/services';
using { Image, Attachments } from '@cap-js/attachments';

extend my.Incidents with { attachments: Attachments }
extend my.Customers with { avatar: Image }
