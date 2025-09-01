using ProcessorService as service from '../../srv/processor-service';
using from '../../db/schema';

annotate service.Customers with @title : '{i18n>Customer}';
annotate service.Incidents with @title : '{i18n>Incident}';
annotate service.Incidents with @odata.draft.enabled;


annotate service.Incidents with {
  status  @Common.Label : '{i18n>Status}';
  urgency @Common.Label : '{i18n>Urgency}';
  status  @Common.ValueListWithFixedValues : true;
  urgency @Common.ValueListWithFixedValues : true;
};

annotate service.Incidents with {
  status   @Common.Text : status.descr;
  urgency  @Common.Text : urgency.descr;
  customer @Common.Text : {
    $value : customer.name,
    ![@UI.TextArrangement] : #TextOnly,
  };
};

annotate service.Incidents with @UI.LineItem : [
  { Value : title,              Label : '{i18n>Title}'    },
  { Value : customer.name,      Label : '{i18n>Customer}' },
  { Value : status.descr,       Label : '{i18n>Status}',  Criticality : status.criticality   },
  { Value : urgency.descr,      Label : '{i18n>Urgency}'  },
];

annotate service.Incidents with @UI.HeaderInfo : {
  Title :          { Value : title  },
  TypeName :       '',
  TypeNamePlural : '',
  Description :    { Value : customer.name  },
  TypeImageUrl :   'sap-icon://alert',
};

annotate service.Incidents with @(
  UI.FieldGroup #GeneratedGroup1 : { Data : [
    { Value : title,            Label : '{i18n>Title}' },
  ]},
  UI.FieldGroup #CustomerInfo : { Data : [
    { Value : customer_ID,      Label : 'Name'    },
    { Value : address,          Label : 'Address' },
    { Value : customer.country, Label : 'Country' },
  ]},
  UI.FieldGroup #i18nDetails : { Data : [
    { Value : status_code,      Criticality : status.criticality  },
    { Value : urgency_code                                        },
  ]},
  UI.Facets : [{
    $Type : 'UI.CollectionFacet',
    Label : '{i18n>Overview}',
    ID : 'i18nOverview',
    Facets : [{
      $Type : 'UI.ReferenceFacet',
      Label : 'General Information',
      ID : 'GeneratedFacet1',
      Target : '@UI.FieldGroup#GeneratedGroup1',
    },
    {
      $Type : 'UI.ReferenceFacet',
      Label : 'Customer',
      ID : 'CustomerInfo',
      Target : '@UI.FieldGroup#CustomerInfo',
    },
    {
      $Type : 'UI.ReferenceFacet',
      Label : '{i18n>Details}',
      ID : 'i18nDetails',
      Target : '@UI.FieldGroup#i18nDetails',
    }],
  },
  {
    $Type : 'UI.ReferenceFacet',
    Label : '{i18n>Conversation}',
    ID : 'i18nConversation',
    Target : 'conversation/@UI.LineItem#i18nConversation1',
  }]
);

annotate service.Incidents with @UI.SelectionFields : [
  urgency_code,
  status_code,
];

annotate service.Incidents with {
  customer @(Common.ValueList : {
      $Type : 'Common.ValueListType',
      CollectionPath : 'Customers',
      Parameters : [
        {
          $Type : 'Common.ValueListParameterInOut',
          LocalDataProperty : customer_ID,
          ValueListProperty : 'ID',
        },
        {
          $Type : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'name',
        },
        {
          $Type : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty : 'email',
        },
      ],
    },
    Common.ValueListWithFixedValues : false
)};


annotate service.Status with {
  code @Common.Text : descr
};
annotate service.Urgency with {
  code @Common.Text : descr
};

annotate service.Incidents.conversation with @(
  title : '{i18n>Conversation}',
  UI.LineItem #i18nConversation1 : [
    {
      $Type : 'UI.DataField',
      Value : author,
      Label : '{i18n>Author}',
    },
    {
      $Type : 'UI.DataField',
      Value : timestamp,
      Label : '{i18n>ConversationDate}',
    },{
      $Type : 'UI.DataField',
      Value : message,
      Label : '{i18n>Message}',
    },]
);
