namespace sap.cap.issues;

@PersonalData.DataSubjectRole: 'Customer'
@PersonalData.EntitySemantics: 'DataSubject'
entity Dummies {
    key name        : String not null @PersonalData.FieldSemantics: 'DataSubjectID';
        description : String          @PersonalData.IsPotentiallyPersonal;
}
