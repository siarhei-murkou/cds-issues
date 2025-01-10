namespace sap.cap.issues;

entity Dummies {
    key name        : String not null;
        description : String;
}

type ObjectID : String(10) @assert.format: '[0-9]{10}';

entity SharedObjects {
    key ID   : ObjectID;
        name : String not null;

        sub  : Composition of many SharedSubObjects
                   on sub.shared = $self;

        top  : Composition of many SharedTopObjects
                   on $self.top.shared = $self;
}

entity SubObjects {
    key ID     : ObjectID;
        name   : String not null;

        @assert.target
        top    : Association to one TopObjects not null;

        shared : Composition of many SharedSubObjects
                     on shared.sub = $self;
}

entity TopObjects {
    key ID     : ObjectID;
        name   : String not null;
        sub    : Composition of one SubObjects;

        shared : Composition of many SharedTopObjects
                     on shared.top = $self;
}

entity SharedSubObjects {
    @assert.target key shared : Association to one SharedObjects;
    @assert.target key sub    : Association to one SubObjects;
                       type   : String not null;
}

entity SharedTopObjects {
    @assert.target key shared : Association to one SharedObjects;
    @assert.target key top    : Association to one TopObjects;

                       sub    : Association to one SubObjects
                                    on sub.top = $self.top;
}

@singular: 'AdvancedSharedTopObject'
@plural  : 'AdvancedSharedTopObjects'
entity AdvancedSharedTopObjects as
    projection on SharedTopObjects {
        *,
        sub.ID as sub_ID,
        linked : Composition of one SharedSubObjects on linked.sub.ID    = $self.sub_ID
                 and                                    linked.shared.ID = $self.shared.ID
    };
