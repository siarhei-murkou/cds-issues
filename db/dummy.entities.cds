namespace sap.cap.issues;

entity Dummies {
    key ID          : UUID;
        name        : String not null;
        description : String;

        sets        : Composition of many DummySets
                          on sets.dummy = $self;
}

@assert.unique: {UK: [
    dummy,
    prop_001,
    prop_002
]}
entity DummySets {
    key ID                   : UUID;

        prop_001             : UUID not null;
        prop_002             : UUID not null;

        @assert.target dummy : Association to one Dummies not null;
}
