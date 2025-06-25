namespace sap.cap.issues;

entity Dummies {
    key ID              : UUID;

        /** defining mandatory props */

        name            : String not null;

        /** defining null-ish props */

        optionalProp001 : String;
        optionalProp002 : String;
        optionalProp003 : String;
        optionalProp004 : String;

        /** defining nested objects */

        nested          : Composition of many NestedObjects
                              on nested.dummy = $self;
}

entity NestedObjects {
    key ID              : UUID;

        @assert.target
        dummy           : Association to one Dummies not null;

        optionalProp001 : String;
        optionalProp002 : String;
}
