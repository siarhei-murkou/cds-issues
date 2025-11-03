using sap.cap.issues as db from '../db';

@path: '/dummy-service'
@impl: './dist/event-handlers/dummy.cds.service'
service DummyService {
    entity Dummies as projection on db.Dummies;

    function fn001(p: String) returns String not null;
    function fn002()          returns String not null;
}
