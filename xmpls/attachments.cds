
using { sap.capire.incidents as my } from '../app/services';
using { Attachments } from '@cap-js/attachments';

extend my.Incidents with { attachments: Attachments }
