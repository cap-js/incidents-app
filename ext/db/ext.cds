namespace x_ext; // for new entities like SalesRegion below
using  from '_base';

extend sap.capire.incidents.Incidents with { foo: String};

annotate ProcessorService.Incidents with @UI.LineItem : [..., { Value: foo}];