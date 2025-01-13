namespace sap.cap.issues;

entity Dummies {
    name        : String not null;
    description : String;
}

@singular: 'MyDummy'
@plural  : 'MyDummies'
entity CustomDummies as
    projection on Dummies {
        name,
        description
    };
