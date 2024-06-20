using {sap.capire.incidents as my} from './schema';

annotate my.Customers with @PersonalData     : {
    DataSubjectRole: 'Customer',
    EntitySemantics: 'DataSubject'
} {
    ID           @PersonalData.FieldSemantics: 'DataSubjectID';
    firstName    @PersonalData.IsPotentiallyPersonal;
    firstName    @changelog;
    lastName     @PersonalData.IsPotentiallyPersonal;
    email        @PersonalData.IsPotentiallyPersonal;
    phone        @PersonalData.IsPotentiallyPersonal;
    creditCardNo @PersonalData.IsPotentiallySensitive;
};
annotate my.Addresses with @PersonalData      : {EntitySemantics: 'DataSubjectDetails'} {
    customer      @PersonalData.FieldSemantics: 'DataSubjectID';
    city          @PersonalData.IsPotentiallyPersonal;
    postCode      @PersonalData.IsPotentiallyPersonal;
    streetAddress @PersonalData.IsPotentiallyPersonal;
};

